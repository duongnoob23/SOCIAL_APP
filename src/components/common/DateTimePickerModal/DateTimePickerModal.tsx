import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import CenteredModal from '@/components/modal/CenteredModal';
import { Box } from '@/components/common/Layout/Box';
import Button from '@/components/common/Button/Button';
import { FontSize } from '@/theme/fonts';

export interface DateTimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (dateTime: Date) => void | Promise<void>;
  initialDateTime?: Date;
  maxDate?: Date;
  minDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
  autoCloseOnConfirm?: boolean;
}

export function DateTimePickerModal({
  visible,
  onClose,
  onConfirm,
  initialDateTime,
  maxDate,
  minDate,
  mode = 'datetime',
  autoCloseOnConfirm = true,
}: DateTimePickerModalProps) {
  const { t, i18n } = useTranslation('common');
  const { colors } = useTheme();
  const [tempDate, setTempDate] = useState<Date>(initialDateTime || new Date());
  const [submitting, setSubmitting] = useState(false);
  const locale = useMemo(() => (i18n.language ?? 'en').replace(/_/g, '-'), [i18n.language]);

  useEffect(() => {
    if (visible) {
      const base = initialDateTime ?? new Date();
      const clamped =
        (minDate && base < minDate) ? minDate :
        (maxDate && base > maxDate) ? maxDate :
        base;
      setTempDate(clamped);
    }
  }, [visible, initialDateTime, minDate, maxDate]);

  const handleOk = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onConfirm(tempDate);
      if (autoCloseOnConfirm) onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CenteredModal visible={visible} onClose={onClose}>
      <Box px={16} bgColor={colors.card}>
        <DatePicker
          date={tempDate}
          onDateChange={setTempDate}
          maximumDate={maxDate}
          minimumDate={minDate}
          mode={mode}
          locale={locale}
          is24hourSource="locale"
          style={{ alignSelf: 'center' }}
        />

        <Box flexDirection='row' justifyContent='flex-end' alignItems='center' gap={16}>
          <Button
            variant='text'
            text={t('cancel')}
            contentStyle={{ minWidth: 80 }}
            textStyle={{ fontSize: FontSize.EXTRA_LARGE, fontWeight: 'bold' }}
            disabled={submitting}
            onPress={onClose}
          />
          <Button
            variant='text'
            text={t('ok')}
            contentStyle={{ minWidth: 80 }}
            textStyle={{ fontSize: FontSize.EXTRA_LARGE, fontWeight: 'bold' }}
            disabled={submitting}
            onPress={handleOk}
          />
        </Box>
      </Box>
    </CenteredModal>
  );
}

