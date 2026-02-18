import React, { useState, useLayoutEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, ButtonIcon, ButtonText, theme } from '@/components/ui';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { useGenerateReport } from '@/core/reports/hooks/useGenerateReport';
import { toast } from 'sonner-native';
import { Ionicons } from '@expo/vector-icons';

const ReportsScreen = () => {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const generateMutation = useGenerateReport();

  const handleGenerate = async (s: string | null, e: string | null) => {
    if (!s || !e) {
      toast.error(t('invalidDateRange'));
      return;
    }

    try {
      await generateMutation.mutateAsync(
        { startDate: s, endDate: e },
        {
          onSuccess: (data) => {
            console.log('Report generated successfully:', data);
            toast.success(t('reportGeneratedSuccessfully'));
          },
          onError: (err: any) => {
            console.error('Error generating report:', err);
            toast.error(
              err?.response?.data?.message || err?.message || t('errorGeneratingReport'),
            );
          },
        },
      );
    } catch (err) {
      // Error already handled in onError
      console.error('Error in handleGenerate:', err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('reports'),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ marginRight: 30 }}
        >
          <Ionicons name="menu" size={24} color={theme.foreground} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            size="icon"
            variant="ghost"
            onPress={() => handleGenerate(startDate, endDate)}
            disabled={generateMutation.isPending}
          >
            <ButtonIcon
              name={generateMutation.isPending ? 'hourglass-outline' : 'download-outline'}
              style={{ color: theme.primary }}
            />
          </Button>
        </View>
      ),
    });
  }, [navigation, t, startDate, endDate, generateMutation.isPending]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <DateRangePicker
        startISO={startDate}
        endISO={endDate}
        onChange={(s, e) => {
          setStartDate(s);
          setEndDate(e);
        }}
        onGenerate={(s, e) => handleGenerate(s, e)}
      />
    </View>
  );
};

export default ReportsScreen;
