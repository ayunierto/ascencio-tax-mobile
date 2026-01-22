import React, { useState, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/Select';
import { ExpenseResponse } from '@/core/accounting/expenses/interfaces';
import {
  ExpenseFormFields,
  ExpenseFormInput,
  expenseFormSchema,
} from '@/core/accounting/expenses/schemas';
import DateTimePicker from '@/components/ui/DateTimePicker/DateTimePicker';
import { Category } from '@/core/accounting/categories/interfaces/category.interface';
import { useExpenseMutation } from '@/core/accounting/expenses/hooks/useExpenseMutation';
import {
  Button,
  ButtonIcon,
  ButtonText,
  theme,
  ImageUploader,
  ImageUploaderRef,
} from '@/components/ui';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Subcategory } from '@/core/accounting/subcategories/interfaces';
import ErrorMessage from '@/core/components/ErrorMessage';
import { DeleteConfirmationDialog } from '@/core/components';
import { useDeleteExpense } from '@/core/accounting/expenses/hooks/useDeleteExpense';
import { useReceiptImageMutation } from '@/core/accounting/expenses/hooks/useReceiptImageMutation';

interface ExpenseFormProps {
  expense: ExpenseResponse;
  categories: Category[];
}

export default function ExpenseForm({ expense, categories }: ExpenseFormProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const imageUploaderRef = useRef<ImageUploaderRef>(null);
  const lastScannedImageRef = useRef<string | undefined>(undefined);
  const hasAutoScannedRef = useRef<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(
    categories.find((cat) => cat.id === expense.category?.id)?.subcategories ||
      [],
  );

  const { getReceiptValuesMutation } = useReceiptImageMutation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<ExpenseFormInput>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      id: expense.id,
      date: expense.date,
      merchant: expense.merchant,
      total: expense.total.toString(),
      tax: expense.tax.toString(),
      imageUrl: expense.imageUrl || undefined,
      notes: expense.notes || undefined,
      categoryId: expense.category?.id || undefined,
      subcategoryId: expense.subcategory?.id || undefined,
    },
  });

  // Update form when expense changes (after scan)
  React.useEffect(() => {
    reset({
      id: expense.id,
      date: expense.date,
      merchant: expense.merchant,
      total: expense.total.toString(),
      tax: expense.tax.toString(),
      imageUrl: expense.imageUrl || undefined,
      notes: expense.notes || undefined,
      categoryId: expense.category?.id || undefined,
      subcategoryId: expense.subcategory?.id || undefined,
    });
  }, [expense, reset]);

  const expenseMutation = useExpenseMutation();
  const deleteExpense = useDeleteExpense();

  const watchedImageUrl = watch('imageUrl');
  const previousImageUrlRef = useRef<string | undefined>(watchedImageUrl);

  // Auto scan when a new temp receipt image is uploaded (form value)
  React.useEffect(() => {
    const previousImageUrl = previousImageUrlRef.current;
    const currentImageUrl = watchedImageUrl;

    // Update the previous value for next comparison
    previousImageUrlRef.current = currentImageUrl;

    // Don't scan if no image
    if (!currentImageUrl) return;

    // Don't scan if not a temp image (already saved images)
    if (!currentImageUrl.startsWith('temp_receipts/')) return;

    // Don't scan if it's the same image we already scanned
    if (lastScannedImageRef.current === currentImageUrl) return;

    // CRITICAL: Don't scan on initial mount - only when image actually changes
    // This prevents scanning when opening an existing expense from the list
    if (previousImageUrl === currentImageUrl) return;

    // Don't scan if this is the first render and image was already there
    // (opening existing expense with image)
    if (previousImageUrl === undefined && expense.imageUrl === currentImageUrl)
      return;

    // Mark this image as scanned
    lastScannedImageRef.current = currentImageUrl;
    hasAutoScannedRef.current = true;

    // Convert relative path to full Cloudinary URL
    const cloudinaryCloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudinaryCloudName) {
      console.error('Cloudinary cloud name not configured');
      return;
    }
    const fullImageUrl = `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${currentImageUrl}`;
    handleScanReceipt(fullImageUrl);
  }, [watchedImageUrl, expense.imageUrl]);

  const onSubmit = async (values: ExpenseFormInput) => {
    // Convert string values to numbers for API
    const expenseData: ExpenseFormFields = {
      ...values,
      total: parseFloat(values.total),
      tax: parseFloat(values.tax),
    };

    await expenseMutation.mutateAsync(expenseData, {
      onSuccess: () => {
        // Mark image as saved to prevent cleanup
        imageUploaderRef.current?.markAsSaved();
        toast.success(
          expense.id === 'new'
            ? t('expenseCreatedSuccessfully')
            : t('expenseUpdatedSuccessfully'),
        );
        reset();
        // Navigation handled by useExpenseMutation for new expenses
        if (expense.id !== 'new') {
          setTimeout(() => router.back(), 500);
        }
      },
      onError: (error) => {
        toast.error(error.response?.data.message || error.message);
      },
    });
  };

  const handleDeleteExpense = async () => {
    setIsDeleting(true);
    try {
      await deleteExpense.mutateAsync(expense.id, {
        onSuccess: () => {
          toast.success(t('deleteSuccess'));
          setTimeout(() => router.back(), 500);
        },
        onError: (error) => {
          toast.error(
            t(error.response?.data?.message || error.message || 'canNotDelete'),
          );
          setIsDeleting(false);
        },
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error(t('unknownError'));
      setIsDeleting(false);
    }
  };

  /**
   * Handle OCR scanning of receipt after image upload
   */
  const handleScanReceipt = async (imageUrl: string) => {
    setIsScanning(true);
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading(t('extractingReceiptValues'));

      const extractedValues = await getReceiptValuesMutation.mutateAsync(
        imageUrl,
        {
          onError: (error) => {
            toast.error(t('errorGettingReceiptValues'), {
              description: error.response?.data.message || error.message,
            });
          },
        },
      );

      // Update form with extracted values (convert numbers to strings)
      if (extractedValues.merchant) {
        setValue('merchant', extractedValues.merchant);
      }
      if (extractedValues.date) {
        setValue('date', extractedValues.date);
      }
      if (extractedValues.total) {
        setValue('total', extractedValues.total.toString());
      }
      if (extractedValues.tax) {
        setValue('tax', extractedValues.tax.toString());
      }

      toast.success(t('receiptScannedSuccessfully'));
      toast.dismiss(toastId);
    } catch (error) {
      console.error('Error scanning receipt:', error);
      toast.error(t('errorGettingReceiptValues'));
      if (toastId) toast.dismiss(toastId);
    } finally {
      setIsScanning(false);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: expense.id === 'new' ? t('newExpense') : t('expenseDetails'),
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Button
            variant="ghost"
            size="icon"
            isLoading={expenseMutation.isPending}
            onPress={handleSubmit(onSubmit)}
            disabled={expenseMutation.isPending}
          >
            <ButtonIcon name="save-outline" style={{ color: theme.primary }} />
          </Button>

          {expense.id !== 'new' && (
            <DeleteConfirmationDialog onDelete={handleDeleteExpense}>
              <Button
                size="icon"
                variant="ghost"
                disabled={deleteExpense.isPending}
                isLoading={deleteExpense.isPending}
              >
                <ButtonIcon
                  name="trash-outline"
                  style={{ color: theme.destructive }}
                />
              </Button>
            </DeleteConfirmationDialog>
          )}
        </View>
      ),
    });
  }, [
    expense.id,
    t,
    handleSubmit,
    onSubmit,
    handleDeleteExpense,
    expenseMutation.isPending,
    isDeleting,
  ]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}
    >
      <ScrollView
        style={{ padding: 16, paddingTop: 8 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, gap: 16 }}>
          <Controller
            control={control}
            name="imageUrl"
            render={({ field: { onChange, value } }) => (
              <View style={{ gap: 8 }}>
                <ImageUploader
                  ref={imageUploaderRef}
                  value={value}
                  onChange={onChange}
                  folder="temp_receipts"
                  label={t('receiptImage')}
                  allowCamera={true}
                  allowGallery={true}
                />
              </View>
            )}
          />
          {errors.id && <ErrorMessage message={errors.id.message} />}
          {errors.imageUrl && (
            <ErrorMessage message={errors.imageUrl.message} />
          )}
          {errors.notes && <ErrorMessage message={errors.notes.message} />}

          <Controller
            control={control}
            name={'merchant'}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('merchant')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.merchant}
                errorMessage={getErrorMessage(errors.merchant)}
              />
            )}
          />

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                labelText={t('date')}
                error={!!errors.date}
                errorMessage={getErrorMessage(errors.date)}
                value={value ?? null}
                mode="date"
                onChange={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="total"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('total')}
                value={value?.toString() || ''}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="decimal-pad"
                error={!!errors.total}
                errorMessage={getErrorMessage(errors.total)}
              />
            )}
          />

          <Controller
            control={control}
            name="tax"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('tax')}
                value={value?.toString() || ''}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="decimal-pad"
                error={!!errors.tax}
                errorMessage={getErrorMessage(errors.tax)}
              />
            )}
          />

          <Controller
            control={control}
            name={'categoryId'}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value}
                onValueChange={(id) => {
                  onChange(id); // setValue("categoryId", id);
                  const sub =
                    categories.find((cat) => cat.id === id)?.subcategories ||
                    [];
                  setSubcategories(sub);
                  setValue('subcategoryId', undefined);
                }}
                error={!!errors.categoryId}
                errorMessage={getErrorMessage(errors.categoryId)}
                options={categories.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
              >
                <SelectTrigger
                  placeholder={t('selectACategory')}
                  labelText={t('category')}
                />
                <SelectContent>
                  <ScrollView>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        label={cat.name}
                        value={cat.id}
                      />
                    ))}
                  </ScrollView>
                </SelectContent>
              </Select>
            )}
          />

          {subcategories && subcategories.length > 0 && (
            <Controller
              control={control}
              name={'subcategoryId'}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value}
                  onValueChange={onChange}
                  options={subcategories.map((sub) => ({
                    label: sub.name,
                    value: sub.id,
                  }))}
                >
                  <SelectTrigger
                    placeholder={t('selectASubcategory')}
                    labelText={t('subcategory')}
                  />
                  <SelectContent>
                    <ScrollView>
                      {subcategories.map((sub) => (
                        <SelectItem
                          key={sub.id}
                          label={sub.name}
                          value={sub.id}
                        />
                      ))}
                    </ScrollView>
                  </SelectContent>
                </Select>
              )}
            />
          )}

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('notes')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.notes}
                errorMessage={getErrorMessage(errors.notes)}
              />
            )}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
