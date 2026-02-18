import React, { useState, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner-native';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/Select';
import DateTimePicker from '@/components/ui/DateTimePicker/DateTimePicker';
import { Category } from '@/core/accounting/categories/interfaces/category.interface';
import {
  Button,
  ButtonIcon,
  theme,
  ImageUploader,
  ImageUploaderRef,
} from '@/components/ui';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { DeleteConfirmationDialog, FormViewContainer } from '@/core/components';
import { useReceiptImageMutation } from '@/core/accounting/expenses/hooks/useReceiptImageMutation';
import {
  CreateExpenseInput,
  createExpenseSchema,
  Expense,
  Subcategory,
} from '@ascencio/shared';
import {
  createExpenseMutation,
  deleteExpenseMutation,
  updateExpenseMutation,
} from '../../hooks';

interface ExpenseFormProps {
  expense: Expense;
  categories: Category[];
}

export default function ExpenseForm({ expense, categories }: ExpenseFormProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const imageUploaderRef = useRef<ImageUploaderRef>(null);
  const lastScannedImageRef = useRef<string | undefined>(undefined);
  const hasAutoScannedRef = useRef<boolean>(false);
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
  } = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      id: expense.id,
      date: expense.date.toString(),
      merchant: expense.merchant,
      total: expense.total,
      tax: expense.tax,
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
      date: expense.date.toString(),
      merchant: expense.merchant,
      total: expense.total,
      tax: expense.tax,
      imageUrl: expense.imageUrl || undefined,
      notes: expense.notes || undefined,
      categoryId: expense.category?.id || undefined,
      subcategoryId: expense.subcategory?.id || undefined,
    });
  }, [expense, reset]);

  const createMutation = createExpenseMutation();
  const updateMutation = updateExpenseMutation();
  const deleteMutation = deleteExpenseMutation();

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

  const onSubmit = async (data: CreateExpenseInput) => {
    // Validate and transform data through schema (converts strings to numbers)
    const validatedData = createExpenseSchema.parse(data);
    
    if (validatedData.id && validatedData.id !== 'new') {
      await updateMutation.mutateAsync(validatedData, {
        onSuccess: () => {
          // Mark image as saved to prevent cleanup
          imageUploaderRef.current?.markAsSaved();
          toast.success(t('expenseUpdatedSuccessfully'));
        },
        onError: (error) => {
          toast.error(error.response?.data.message || error.message);
        },
      });
      return;
    }

    await createMutation.mutateAsync(validatedData, {
      onSuccess: () => {
        // Mark image as saved to prevent cleanup
        imageUploaderRef.current?.markAsSaved();
        toast.success(
          expense.id === 'new'
            ? t('expenseCreatedSuccessfully')
            : t('expenseUpdatedSuccessfully'),
        );
        // Navigate back to expenses list after successful creation
        setTimeout(() => router.back(), 500);
      },
      onError: (error) => {
        toast.error(error.response?.data.message || error.message);
      },
    });
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(expense.id, {
        onSuccess: () => {
          toast.success(t('deleteSuccess'));
          setTimeout(() => router.back(), 500);
        },
        onError: (error) => {
          toast.error(
            t(error.response?.data?.message || error.message || 'canNotDelete'),
          );
        },
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error(t('unknownError'));
    }
  };

  /**
   * Handle OCR scanning of receipt after image upload
   */
  const handleScanReceipt = async (imageUrl: string) => {
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
        setValue('total', extractedValues.total);
      }
      if (extractedValues.tax) {
        setValue('tax', extractedValues.tax);
      }

      toast.success(t('receiptScannedSuccessfully'));
      toast.dismiss(toastId);
    } catch (error) {
      console.error('Error scanning receipt:', error);
      toast.error(t('errorGettingReceiptValues'));
      if (toastId) toast.dismiss(toastId);
    }
  };

  // Header buttons
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: expense.id === 'new' ? t('newExpense') : t('expenseDetails'),
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Button
            variant="ghost"
            size="icon"
            isLoading={createMutation.isPending}
            onPress={handleSubmit(onSubmit)}
            disabled={createMutation.isPending}
          >
            <ButtonIcon name="save-outline" style={{ color: theme.primary }} />
          </Button>

          {expense.id !== 'new' && (
            <DeleteConfirmationDialog onDelete={handleDelete}>
              <Button
                size="icon"
                variant="ghost"
                disabled={deleteMutation.isPending}
                isLoading={deleteMutation.isPending}
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
    handleDelete,
    createMutation.isPending,
    navigation,
    deleteMutation.isPending,
  ]);

  return (
    <FormViewContainer>
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
              // error={!!errors.imageUrl}
              // errorMessage={getErrorMessage(errors.imageUrl)}
              // isScanning={isScanning}
            />
          </View>
        )}
      />

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
                categories.find((cat) => cat.id === id)?.subcategories || [];
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
                  <SelectItem key={cat.id} label={cat.name} value={cat.id} />
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
                    <SelectItem key={sub.id} label={sub.name} value={sub.id} />
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
    </FormViewContainer>
  );
}
