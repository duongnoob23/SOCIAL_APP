import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Pressable,
  Dimensions,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '@react-navigation/native';
import { Text } from '@/components/common/Text/Text';
import { Box } from '@/components/common/Layout/Box';
import { FontSize } from '@/theme/fonts';
import { ChevronLeft } from '@/assets/icons/ChevronLeft';
import { BlurView } from 'expo-blur';
import Reanimated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import dayjs from '@/lib/dayjs';

export interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  maxDate?: string; // YYYY-MM-DD format
  minDate?: string;
}

export function DatePickerModal({
  visible,
  onClose,
  selectedDate,
  onDateSelect,
  maxDate,
  minDate
}: DatePickerModalProps) {
  const { colors } = useTheme();
  const { width } = Dimensions.get('window');
  const [currentDate, setCurrentDate] = useState(() => {
    if (selectedDate) {
      return selectedDate;
    }
    return new Date().toISOString().split('T')[0];
  });

  const AnimatedBlurView = Reanimated.createAnimatedComponent(BlurView);
  
  const [forceRender, setForceRender] = useState(0);
  
  const [showYearPicker, setShowYearPicker] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    
    if (visible) {
      if (selectedDate) {
        setCurrentDate(selectedDate);
      } else {
        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);
      }
    }
  }, [selectedDate, visible]);

  const handleDayPress = (day: any) => {
    onDateSelect(day.dateString);
    onClose();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    
    const current = new Date(currentDate + 'T00:00:00'); 
    const year = current.getFullYear();
    const month = current.getMonth();
    
    
    let newYear = year;
    let newMonth = month;
    
    if (direction === 'next') {
      newMonth = month + 1;
      if (newMonth > 11) {
        newMonth = 0;
        newYear = year + 1;
      }
    } else if (direction === 'prev') {
      newMonth = month - 1;
      if (newMonth < 0) {
        newMonth = 11;
        newYear = year - 1;
      }
    }
    
    const newDate = new Date(newYear, newMonth, 1);
    const formattedDate = `${newYear}-${String(newMonth + 1).padStart(2, '0')}-01`;
    
    setCurrentDate(formattedDate);
    setForceRender(prev => prev + 1); 
  };

  const getCurrentMonthYear = () => {
    return dayjs(currentDate).format('MMMM YYYY');
  };

  const handleYearSelect = (year: number) => {
    setShowYearPicker(false);
    const current = new Date(currentDate);
    const newDate = new Date(year, current.getMonth(), 1);
    setCurrentDate(newDate.toISOString().split('T')[0]);
    setForceRender(prev => prev + 1);
  };

  const getCurrentYear = () => {
    return new Date(currentDate).getFullYear();
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 100; year--) {
      years.push(year);
    }
    return years;
  };

  const scrollToCurrentYear = (scrollViewRef: any) => {
    if (scrollViewRef) {
      setTimeout(() => {
        scrollViewRef.scrollTo({
          y: 0, 
          animated: true,
        });
      }, 100);
    }
  };

  const blur = useSharedValue(0);

  useEffect(() => {
    blur.value = withTiming(visible ? 2 : 0, { duration: 200 });
  }, [visible]);

  const animatedProps = useAnimatedProps(() => ({ intensity: blur.value }));

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable 
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 0,
        }} 
        onPress={onClose}
      >
        {/* Blur overlay that fills the screen */}
        <AnimatedBlurView
          animatedProps={animatedProps}
          tint='dark'
          style={StyleSheet.absoluteFillObject}
          pointerEvents='none'
        />
        {/* Dim background at 50% black on top of blur */}
        <Box
          pointerEvents='none'
          style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
        />
        <Pressable
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 8,
            overflow: 'hidden',
            width: width < 500 ? width - 32 : 500,
            paddingHorizontal: 8,
          }}
          onPress={e => e.stopPropagation()}
        >
          {/* Custom Header */}
          <Box
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            backgroundColor={colors.background}
            borderRadius={8}
            paddingTop={16}
            paddingY={12}
            marginX={10}
            marginBottom={8}  
            zIndex={1}            
          >
            <TouchableOpacity 
              onPress={() => {
                setShowYearPicker(true);
                setTimeout(() => {
                  scrollToCurrentYear(scrollViewRef.current);
                }, 300);
              }}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text 
                style={{
                  fontSize: FontSize.EXTRA_LARGE,
                  fontWeight: 'semibold',
                  color: colors.text,
                  marginRight: 8,
                }}
              >
                {getCurrentMonthYear()}
              </Text>
              <ChevronLeft 
                size={FontSize.EXTRA_EXTRA_LARGE} 
                color={colors.text} 
                style={{ transform: [{ rotate: '180deg' }] }} 
              />
            </TouchableOpacity>
            <Box flexDirection='row' alignItems='center' gap={16}>
              <TouchableOpacity 
                onPress={() => navigateMonth('prev')}
                style={{ padding: 4 }}
              >
                <ChevronLeft size={FontSize.HEADING} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigateMonth('next')}
                style={{ padding: 4 }}
              >
                <ChevronLeft 
                  size={FontSize.HEADING} 
                  color={colors.text} 
                  style={{ transform: [{ rotate: '180deg' }] }} 
                />
              </TouchableOpacity>
            </Box>
          </Box>
          
          {/* Custom Day Header - Uppercase */}
          <Box
              flexDirection='row'
              justifyContent='space-around'
              alignItems='center'
              paddingY={8}
              // paddingX={16}
              backgroundColor={colors.background}
              zIndex={1}
              marginTop={-12}
          >
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
              <Text 
                key={index}
                style={{
                  fontSize: FontSize.MEDIUM,
                  color: (colors as any)?.palette?.greyscale?.[200] ?? colors.textSecondary,
                  fontWeight: '500',
                  textAlign: 'center',
                  flex: 1,
                  textTransform: 'uppercase',
                }}
              >
                {day}
              </Text>
            ))}
          </Box>
          
          <Calendar
            key={`${currentDate}-${forceRender}`} 
            current={currentDate}
            onDayPress={handleDayPress}
            onMonthChange={(month: any) => {
              if (month.dateString !== currentDate) {
                setCurrentDate(month.dateString);
              }
            }}
            markedDates={
              selectedDate
                ? {
                    [selectedDate]: {
                      selected: true,
                      selectedColor: colors.primary,
                      selectedTextColor: colors.onPrimary,
                    },
                  }
                : {}
            }
            minDate={minDate}
            maxDate={maxDate}
            firstDay={0} 
            enableSwipeMonths={false} 
            disableMonthChange={false}
            style={{
              borderRadius: 16,
              height: 310,
              marginTop: -24,
              paddingHorizontal: 0,
            }}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.background,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.onPrimary,
              todayTextColor: colors.text,
              dayTextColor: colors.text,
              textDisabledColor: colors.textTertiary,
              dotColor: colors.primary,
              selectedDotColor: colors.onPrimary,
              arrowColor: 'transparent',
              disabledArrowColor: 'transparent',
              monthTextColor: 'transparent',
              indicatorColor: colors.primary,
              textDayFontSize: FontSize.EXTRA_LARGE,
              textMonthFontSize: 1,
              textDayHeaderFontSize: FontSize.MEDIUM,
              'stylesheet.day.basic': {
                base: {
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                },
                today: {
                  backgroundColor: colors.primary + '20',
                  borderRadius: 20,
                },
                selected: {
                  backgroundColor: colors.primary,
                  borderRadius: 20,
                },
              },
            } as any}
            hideArrows={true}
            hideExtraDays={true}
            hideDayNames={true}
          />
        </Pressable>
      </Pressable>

      {showYearPicker && (
        <Modal
          visible={showYearPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowYearPicker(false)}
        >
          <Pressable 
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setShowYearPicker(false)}
          >
            <Pressable
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 20,
                width: width * 0.8,
                maxHeight: 400,
              }}
              onPress={e => e.stopPropagation()}
            >
              <Text 
                style={{
                  fontSize: FontSize.EXTRA_LARGE,
                  fontWeight: 'bold',
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                Select Year
              </Text>
              <ScrollView 
                ref={scrollViewRef}
                style={{ maxHeight: 300 }}
                showsVerticalScrollIndicator={true}
                onLayout={() => {
                  setTimeout(() => {
                    scrollToCurrentYear(scrollViewRef.current);
                  }, 100);
                }}
              >
                {generateYears().map((year) => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => handleYearSelect(year)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      backgroundColor: year === getCurrentYear() ? colors.primary : 'transparent',
                      borderRadius: 8,
                      marginVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FontSize.LARGE,
                        color: year === getCurrentYear() ? colors.onPrimary : colors.text,
                        textAlign: 'center',
                        fontWeight: year === getCurrentYear() ? 'bold' : 'normal',
                      }}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </Modal>
  );
}