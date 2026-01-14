import React, { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import {
  Invoice,
  CreateInvoiceRequest,
  createInvoiceSchema,
} from '@ascencio/shared';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { theme, Button, ButtonText, ButtonIcon } from '@/components/ui';
import { ThemedText } from '@/components/ui/ThemedText';
import DateTimePicker from '@/components/ui/DateTimePicker/DateTimePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/Select';
import { ImageUploader } from '@/components/ui/ImageUploader';
import {
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useUpdateInvoiceMutation,
  useGeneratePdfMutation,
} from '../hooks';
import { useCompanies } from '../../companies/hooks';
import { useClients } from '../../clients/hooks';

interface InvoiceFormProps {
  invoice: Invoice;
}

interface LineItemLocal {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

const generateLocalId = () =>
  `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const InvoiceForm = ({ invoice }: InvoiceFormProps) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Initialize line items from invoice or with one empty row
  const [lineItems, setLineItems] = useState<LineItemLocal[]>(() => {
    if (invoice.lineItems && invoice.lineItems.length > 0) {
      return invoice.lineItems.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      }));
    }
    return [{ id: generateLocalId(), description: '', quantity: 1, price: 0 }];
  });

  const { data: companiesData } = useCompanies();
  const companies = companiesData?.items ?? [];

  const { data: clientsData } = useClients();
  const clients = clientsData?.items ?? [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      fromCompanyId: invoice.fromCompanyId,
      billToClientId: invoice.billToClientId || '',
      taxRate: invoice.taxRate ?? 13,
      description: invoice.description,
      notes: invoice.notes,
      logoUrl: invoice.logoUrl,
      issueDate: invoice.issueDate || new Date().toISOString().split('T')[0],
      dueDate:
        invoice.dueDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      lineItems: invoice.lineItems?.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })) || [{ description: '', quantity: 1, price: 0 }],
      status: invoice.status || 'pending',
    },
  });

  const watchedTaxRate = watch('taxRate') ?? 13;

  // Calculate totals
  const { subtotal, taxAmount, total } = useMemo(() => {
    const sub = lineItems.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
    const tax = sub * (watchedTaxRate / 100);
    return {
      subtotal: sub,
      taxAmount: tax,
      total: sub + tax,
    };
  }, [lineItems, watchedTaxRate]);

  const createInvoice = useCreateInvoiceMutation();
  const updateInvoice = useUpdateInvoiceMutation();
  const deleteInvoice = useDeleteInvoiceMutation();
  const generatePdf = useGeneratePdfMutation();

  const isNew = invoice.id === 'new';

  /**
   * Handler for validation errors - shows toast with first error
   */
  const onValidationError = (formErrors: any) => {
    console.log('Validation errors:', formErrors);

    // Get the first error message
    const getFirstError = (errors: any): string | null => {
      for (const key in errors) {
        const error = errors[key];
        if (error?.message) {
          return typeof error.message === 'string'
            ? error.message
            : t('validationRequired');
        }
        if (Array.isArray(error)) {
          for (const item of error) {
            const nestedError = getFirstError(item);
            if (nestedError) return nestedError;
          }
        }
        if (typeof error === 'object') {
          const nestedError = getFirstError(error);
          if (nestedError) return nestedError;
        }
      }
      return null;
    };

    const firstError = getFirstError(formErrors);
    if (firstError) {
      toast.error(t(firstError) || t('validationRequired'));
    } else {
      toast.error(t('pleaseFixFormErrors'));
    }
  };

  const handleGeneratePdf = async () => {
    if (isNew) return;

    setIsGeneratingPdf(true);
    try {
      await generatePdf.mutateAsync(invoice.id);
      toast.success(t('pdfGenerated'));
    } catch (error: any) {
      toast.error(t(error.response?.data?.message || 'unknownErrorOccurred'));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Update line items in form when local state changes
  const updateLineItemsInForm = (items: LineItemLocal[]) => {
    setLineItems(items);
    setValue(
      'lineItems',
      items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      }))
    );
  };

  const addLineItem = () => {
    const newItems = [
      ...lineItems,
      { id: generateLocalId(), description: '', quantity: 1, price: 0 },
    ];
    updateLineItemsInForm(newItems);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) {
      toast.error(t('atLeastOneLineItemRequired'));
      return;
    }
    const newItems = lineItems.filter((item) => item.id !== id);
    updateLineItemsInForm(newItems);
  };

  const updateLineItem = (
    id: string,
    field: keyof LineItemLocal,
    value: string | number
  ) => {
    const newItems = lineItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateLineItemsInForm(newItems);
  };

  const onSubmit = async (values: any) => {
    // Validate line items
    const validLineItems = lineItems.filter(
      (item) => item.description.trim() !== ''
    );
    if (validLineItems.length === 0) {
      toast.error(t('atLeastOneLineItemRequired'));
      return;
    }

    const submitData: CreateInvoiceRequest = {
      ...values,
      lineItems: validLineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })),
      // Clean empty strings
      logoUrl: values.logoUrl || undefined,
    };

    if (!isNew) {
      await updateInvoice.mutateAsync(
        { id: invoice.id, data: submitData },
        {
          onSuccess: () => {
            toast.success(t('invoiceUpdatedSuccessfully'));
            router.replace('/(app)/invoices');
          },
          onError: (error) => {
            toast.error(
              t(error.response?.data.message || 'unknownErrorOccurred')
            );
          },
        }
      );
      return;
    }

    await createInvoice.mutateAsync(submitData, {
      onSuccess: () => {
        toast.success(t('invoiceCreatedSuccessfully'));
        router.replace('/(app)/invoices');
      },
      onError: (error) => {
        toast.error(t(error.response?.data.message || 'unknownErrorOccurred'));
      },
    });
  };

  const handleDeleteInvoice = async () => {
    Alert.alert(t('deleteInvoice'), t('deleteInvoiceConfirmation'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          try {
            await deleteInvoice.mutateAsync(invoice.id, {
              onSuccess: () => {
                toast.success(t('deleteSuccess'));
                setTimeout(() => router.back(), 500);
              },
              onError: (error) => {
                toast.error(
                  t(
                    error.response?.data?.message ||
                      error.message ||
                      'canNotDelete'
                  )
                );
                setIsDeleting(false);
              },
            });
          } catch (error) {
            console.error('Error deleting invoice:', error);
            toast.error(t('unknownErrorOccurred'));
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: isNew
        ? t('newInvoice')
        : `${t('invoice')} #${invoice.invoiceNumber}`,
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit, onValidationError)}
            disabled={
              createInvoice.isPending || updateInvoice.isPending || isDeleting
            }
          >
            {createInvoice.isPending || updateInvoice.isPending ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Ionicons name="save-outline" size={24} color={theme.primary} />
            )}
          </TouchableOpacity>

          {!isNew && (
            <TouchableOpacity
              onPress={handleDeleteInvoice}
              disabled={
                createInvoice.isPending || updateInvoice.isPending || isDeleting
              }
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={theme.destructive} />
              ) : (
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={theme.destructive}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [
    isNew,
    t,
    invoice.invoiceNumber,
    handleSubmit,
    createInvoice.isPending,
    updateInvoice.isPending,
    isDeleting,
    onValidationError,
  ]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}
    >
      <ScrollView
        style={{ padding: 16, paddingTop: 8 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 100,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, gap: 16 }}>
          {/* Invoice Number (read-only for existing) */}
          {!isNew && (
            <View
              style={{
                padding: 12,
                backgroundColor: theme.card,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <ThemedText style={{ color: theme.muted, fontSize: 12 }}>
                {t('invoiceNumber')}
              </ThemedText>
              <ThemedText style={{ fontWeight: 'bold', fontSize: 18 }}>
                {invoice.invoiceNumber}
              </ThemedText>
            </View>
          )}

          {/* Section: From Company */}
          <View>
            <Controller
              control={control}
              name="fromCompanyId"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value || ''}
                  onValueChange={(val) => onChange(val || undefined)}
                  options={[
                    { label: t('selectCompany'), value: '' },
                    ...companies.map((company) => ({
                      label: company.name,
                      value: company.id,
                    })),
                  ]}
                >
                  <SelectTrigger
                    placeholder={t('selectCompany')}
                    labelText={`${t('fromCompany')} (${t('optional')})`}
                  />
                  <SelectContent>
                    <SelectItem label={t('selectCompany')} value="" />
                    {companies.map((company) => (
                      <SelectItem
                        key={company.id}
                        label={company.name}
                        value={company.id}
                      />
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </View>

          {/* Section: Bill To (Client Selector) */}
          <View>
            <Controller
              control={control}
              name="billToClientId"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Select
                    value={value || ''}
                    onValueChange={(val) => onChange(val)}
                    options={[
                      { label: t('selectClient'), value: '' },
                      ...clients.map((client) => ({
                        label: client.fullName,
                        value: client.id,
                      })),
                    ]}
                  >
                    <SelectTrigger
                      placeholder={t('selectClient')}
                      labelText={`${t('billTo')} *`}
                    />
                    <SelectContent>
                      <SelectItem label={t('selectClient')} value="" />
                      {clients.map((client) => (
                        <SelectItem
                          key={client.id}
                          label={`${client.fullName}${
                            client.email ? ` (${client.email})` : ''
                          }`}
                          value={client.id}
                        />
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.billToClientId && (
                    <ThemedText
                      style={{
                        color: theme.destructive,
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      {getErrorMessage(errors.billToClientId)}
                    </ThemedText>
                  )}
                </View>
              )}
            />
          </View>

          {/* Section: Dates */}
          <View>
            <ThemedText
              style={{ marginBottom: 8, fontWeight: '600', fontSize: 16 }}
            >
              {t('dates')}
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="issueDate"
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      labelText={t('issueDate')}
                      value={value}
                      mode="date"
                      onChange={onChange}
                      error={!!errors.issueDate}
                      errorMessage={errors.issueDate?.message}
                    />
                  )}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      labelText={t('dueDate')}
                      value={value}
                      mode="date"
                      onChange={onChange}
                      error={!!errors.dueDate}
                      errorMessage={errors.dueDate?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>

          {/* Section: Line Items */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <ThemedText style={{ fontWeight: '600', fontSize: 16 }}>
                {t('lineItems')}
              </ThemedText>
              <TouchableOpacity
                onPress={addLineItem}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  padding: 8,
                }}
              >
                <Ionicons name="add-circle" size={20} color={theme.primary} />
                <ThemedText style={{ color: theme.primary, fontWeight: '500' }}>
                  {t('addItem')}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {lineItems.map((item, index) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: theme.card,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <ThemedText style={{ fontWeight: '500', color: theme.muted }}>
                    {t('item')} #{index + 1}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => removeLineItem(item.id)}
                    disabled={lineItems.length <= 1}
                    style={{ opacity: lineItems.length <= 1 ? 0.3 : 1 }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={theme.destructive}
                    />
                  </TouchableOpacity>
                </View>

                <Input
                  label={t('description')}
                  value={item.description}
                  onChangeText={(text) =>
                    updateLineItem(item.id, 'description', text)
                  }
                  style={{ marginBottom: 8 }}
                />

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Input
                    label={t('quantity')}
                    value={item.quantity.toString()}
                    onChangeText={(text) => {
                      const num = parseInt(text) || 0;
                      updateLineItem(item.id, 'quantity', num);
                    }}
                    keyboardType="numeric"
                    style={{ flex: 1 }}
                  />
                  <Input
                    label={t('price')}
                    value={item.price.toString()}
                    onChangeText={(text) => {
                      const num = parseFloat(text) || 0;
                      updateLineItem(item.id, 'price', num);
                    }}
                    keyboardType="decimal-pad"
                    style={{ flex: 1 }}
                  />
                  <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <ThemedText style={{ color: theme.muted, fontSize: 11 }}>
                      {t('lineTotal')}
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        fontFamily: 'monospace',
                      }}
                    >
                      ${(item.quantity * item.price).toFixed(2)}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Section: Tax Rate */}
          <Controller
            control={control}
            name="taxRate"
            render={({ field: { onChange, value } }) => (
              <Input
                label={`${t('taxRate')} (%)`}
                value={(value ?? 13).toString()}
                onChangeText={(text) => {
                  const num = parseFloat(text) || 0;
                  onChange(num);
                }}
                keyboardType="decimal-pad"
                error={!!errors.taxRate}
                errorMessage={errors.taxRate?.message}
              />
            )}
          />

          {/* Section: Financial Summary */}
          <View
            style={{
              backgroundColor: theme.card,
              borderRadius: 8,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <ThemedText
              style={{ fontWeight: '600', fontSize: 16, marginBottom: 12 }}
            >
              {t('summary')}
            </ThemedText>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <ThemedText style={{ color: theme.muted }}>
                {t('subtotal')}
              </ThemedText>
              <ThemedText style={{ fontFamily: 'monospace' }}>
                ${subtotal.toFixed(2)}
              </ThemedText>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <ThemedText style={{ color: theme.muted }}>
                {t('tax')} ({watchedTaxRate}%)
              </ThemedText>
              <ThemedText style={{ fontFamily: 'monospace' }}>
                ${taxAmount.toFixed(2)}
              </ThemedText>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: theme.border,
              }}
            >
              <ThemedText style={{ fontWeight: 'bold', fontSize: 16 }}>
                {t('total')}
              </ThemedText>
              <ThemedText
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  fontFamily: 'monospace',
                }}
              >
                ${total.toFixed(2)}
              </ThemedText>
            </View>
          </View>

          {/* Section: Notes */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('description')}
                onChangeText={onChange}
                value={value || ''}
                multiline
                numberOfLines={2}
                error={!!errors.description}
                errorMessage={errors.description?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('notes')}
                onChangeText={onChange}
                value={value || ''}
                multiline
                numberOfLines={3}
                error={!!errors.notes}
                errorMessage={errors.notes?.message}
                helperText={t('notesHelperText')}
              />
            )}
          />

          {/* Section: Logo */}
          <View>
            <ThemedText
              style={{ marginBottom: 8, fontWeight: '600', fontSize: 16 }}
            >
              {t('logo')} ({t('optional')})
            </ThemedText>
            <Controller
              control={control}
              name="logoUrl"
              render={({ field: { onChange, value } }) => (
                <ImageUploader
                  value={value}
                  onChange={onChange}
                  folder="invoices"
                />
              )}
            />
          </View>

          {/* PDF Actions */}
          {!isNew && (
            <View style={{ gap: 12 }}>
              <Button
                onPress={handleGeneratePdf}
                disabled={isGeneratingPdf}
                variant="outline"
                style={{ flexDirection: 'row', gap: 8 }}
              >
                {isGeneratingPdf ? (
                  <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                  <ButtonIcon name="document-text-outline" />
                )}
                <ButtonText>{t('generatePdf')}</ButtonText>
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
