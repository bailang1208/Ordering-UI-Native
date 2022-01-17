import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import { useLanguage, useUtils, useConfig, useOrder, MomentOption } from 'ordering-components/native'
import { OButton, OModal, OText } from '../shared'
import { useTheme } from 'styled-components/native'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import FastImage from 'react-native-fast-image'
import CalendarStrip from 'react-native-calendar-strip'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { BusinessMenuList } from '../BusinessMenuList'
import Spinner from 'react-native-loading-spinner-overlay'
import { BusinessPreorderParams } from '../../types'
import moment from 'moment'
import {
  PreOrderContainer,
  BusinessInfoWrapper,
  PreorderTypeWrapper,
  MenuWrapper,
  OrderTimeWrapper,
  TimeListWrapper,
  TimeContentWrapper,
  TimeItem,
  PreorderTypeListWrapper,
  DropOption
} from './styles'

const BusinessPreorderUI = (props: BusinessPreorderParams) => {
  const {
    goToBack,
    business,
    datesList,
    hoursList,
    dateSelected,
    timeSelected,
    handleBusinessClick,
    handleChangeDate,
    handleChangeTime
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ optimizeImage, parseTime }] = useUtils()
  const [{ configs }] = useConfig()
  const [orderState] = useOrder()
  const [selectedPreorderType, setSelectedPreorderType] = useState({ key: 'business_hours', name: t('BUSINESS_HOURS', 'Business hours') })
  const [isPreorderTypeList, setIsPreorderTypeList] = useState(false)
  const [menu, setMenu] = useState({})
  const [timeList, setTimeList] = useState<any>([])
  const [selectDate, setSelectedDate] = useState<any>(null)
  const [datesWhitelist, setDateWhitelist] = useState<any>([{start: null, end: null}])

  const styles = StyleSheet.create({
		businessLogo: {
			backgroundColor: 'white',
			width: 60,
			height: 60,
			borderRadius: 7.6,
			justifyContent: 'center',
			alignItems: 'center',
			shadowColor: '#000000',
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 1,
			elevation: 2
		},
    selectOption: {
      backgroundColor: theme.colors.backgroundGray100,
      borderRadius: 7.6,
      paddingVertical: 10,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 44
    },
    calendar: {
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderColor: theme.colors.backgroundGray200,
      height: 90
    },
    calendarHeaderContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      textAlign: 'left',
      marginBottom: 17,
      borderBottomWidth: 1,
      borderColor: theme.colors.backgroundGray200
    },
    calendarHeader: {
      color: '#344050',
      alignSelf: 'flex-start',
      fontSize: 14,
      fontWeight: '400'
    },
    dateNumber: {
      color: '#B1BCCC',
      fontSize: 16,
      fontWeight: '500'
    },
    dateName: {
      color: '#B1BCCC',
      fontSize: 12,
      textTransform: 'capitalize'
    },
    highlightDateName: {
      color: '#344050',
      fontSize: 12,
      textTransform: 'capitalize'
    },
    highlightDateNumber: {
      color: '#344050',
      fontSize: 16,
      textTransform: 'capitalize'
    },
    disabledDateName: {
      color: '#B1BCCC',
      fontSize: 10,
      textTransform: 'capitalize',
      opacity: 1
    },
    disabledDateNumber: {
      color: '#B1BCCC',
      fontSize: 14,
      fontWeight: '500'
    }
	})

  const preorderTypeList = [
    { key: 'business_menu', name: t('BUSINESS_MENU', 'Business menu') },
    { key: 'business_hours', name: t('BUSINESS_HOURS', 'Business hours') }
  ]

  const handleClickPreorderType = (option: any) => {
    setSelectedPreorderType(option)
    setIsPreorderTypeList(false)
  }

  const getTimes = (curdate: any, menu: any) => {
    const date = new Date()
    var dateSeleted = new Date(curdate)
    var times = []
    for (var k = 0; k < menu.schedule[dateSeleted.getDay()].lapses.length; k++) {
      var open = {
        hour: menu.schedule[dateSeleted.getDay()].lapses[k].open.hour,
        minute: menu.schedule[dateSeleted.getDay()].lapses[k].open.minute
      }
      var close = {
        hour: menu.schedule[dateSeleted.getDay()].lapses[k].close.hour,
        minute: menu.schedule[dateSeleted.getDay()].lapses[k].close.minute
      }
      for (var i = open.hour; i <= close.hour; i++) {
        if (date.getDate() !== dateSeleted.getDate() || i >= date.getHours()) {
          let hour = ''
          let meridian = ''
          if (configs?.format_time?.value === '12') {
            if (i === 0) {
              hour = '12'
              meridian = ' ' + t('AM', 'AM')
            } else if (i > 0 && i < 12) {
              hour = (i < 10 ? '0' + i : i)
              meridian = ' ' + t('AM', 'AM')
            } else if (i === 12) {
              hour = '12'
              meridian = ' ' + t('PM', 'PM')
            } else {
              hour = ((i - 12 < 10) ? '0' + (i - 12) : `${(i - 12)}`)
              meridian = ' ' + t('PM', 'PM')
            }
          } else {
            hour = i < 10 ? '0' + i : i
          }
          for (let j = (i === open.hour ? open.minute : 0); j <= (i === close.hour ? close.minute : 59); j += 15) {
            if (i !== date.getHours() || j >= date.getMinutes() || date.getDate() !== dateSeleted.getDate()) {
              times.push({
                text: hour + ':' + (j < 10 ? '0' + j : j) + meridian,
                value: (i < 10 ? '0' + i : i) + ':' + (j < 10 ? '0' + j : j)
              })
            }
          }
        }
      }
    }
    return times
  }

  const onSelectDate = (val: any) => {
    setSelectedDate(val)
    if (handleChangeDate) handleChangeDate(moment(val).format('YYYY-MM-DD'))
  }

  const LeftSelector = () => {
    return (
      <View style={{height: '100%', justifyContent: 'flex-end'}}>
        <IconAntDesign
          name='caretleft'
          color={theme.colors.textNormal}
          size={16}
        />
      </View>
    )
  }

  const RightSelector = () => {
    return (
      <View style={{height: '100%', justifyContent: 'flex-end'}}>
        <IconAntDesign
          name='caretright'
          color={theme.colors.textNormal}
          size={16}
        />
      </View>
    )
  }

  useEffect(() => {
    if (datesList?.length > 0) {
      const _datesList = datesList.slice(0, Number(configs?.max_days_preorder?.value || 6))
      const minDateParts = _datesList[0].split('-')
      const maxDateParts = _datesList[_datesList.length - 1].split('-')
      const _minDate = new Date(minDateParts[0], minDateParts[1] - 1, minDateParts[2])
      const _maxDate = new Date(maxDateParts[0], maxDateParts[1] - 1, maxDateParts[2])
      setDateWhitelist([{ start: _minDate, end: _maxDate }])
    }
  }, [datesList])

  const handleClickBusiness = () => {
    handleBusinessClick && handleBusinessClick(business)
  }

  useEffect(() => {
    if (hoursList.length === 0) return
    if (Object.keys(menu).length > 0) {
      const _times: any = getTimes(selectDate, menu)
      setTimeList(_times)
    } else {
      const _timeLists = hoursList.map((hour: any) => {
        return {
          value: hour.startTime,
          text: configs?.format_time?.value === '12' ? (
            hour.startTime.includes('12')
              ? `${hour.startTime}PM`
              : parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
          ) : (
            parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
          )
        }
      })
      setTimeList(_timeLists)
    }
  }, [selectDate, hoursList, menu])

  useEffect(() => {
    if (selectedPreorderType.key === 'business_hours' && Object.keys(menu).length > 0) setMenu({})
  }, [selectedPreorderType])

  useEffect(() => {
    if (dateSelected) {
      const dateParts = dateSelected.split('-')
      const _dateSelected = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
      setSelectedDate(_dateSelected)
    }
  }, [dateSelected])

  return (
    <>
      <PreOrderContainer>
        <TouchableOpacity onPress={() => goToBack && goToBack()} style={{ marginBottom: 12 }}>
          <IconAntDesign
            name='close'
            color={theme.colors.textThird}
            size={24}
          />
        </TouchableOpacity>
        <BusinessInfoWrapper>
          <OText
            size={20}
            style={{
              fontWeight: '600'
            }}
          >{t('PREORDER', 'Preorder')}</OText>
          <View style={styles.businessLogo}>
            <FastImage
              style={{ width: 59, height: 59 }}
              source={{
                  uri: optimizeImage(business?.logo, 'h_60,c_limit'),
                  priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </BusinessInfoWrapper>
        <PreorderTypeWrapper>
          <OText
            size={16}
            style={{
              fontWeight: '600',
              lineHeight: 24,
              marginBottom: 12
            }}
          >
            {t('PREORDER_TYPE', 'Preorder type')}
          </OText>
          <TouchableOpacity onPress={() => setIsPreorderTypeList(true)}>
            <View style={styles.selectOption}>
              <OText
                size={14}
                color={theme.colors.disabled}
                style={{
                  lineHeight: 24
                }}
              >
                {selectedPreorderType.name}
              </OText>
              <IconAntDesign
                name='down'
                color={theme.colors.textThird}
                size={16}
              />
            </View>
          </TouchableOpacity>
        </PreorderTypeWrapper>
        {selectedPreorderType?.key === 'business_menu' && (
          <MenuWrapper>
            <OText
              size={16}
              style={{
                fontWeight: '600',
                lineHeight: 24,
                marginBottom: 12
              }}
            >
              {t('MENU', 'Menu')}
            </OText>
            <BusinessMenuList
              businessId={business.id}
              setMenu={setMenu}
              menu={menu}
            />
          </MenuWrapper> 
        )}
        <OrderTimeWrapper>
          <OText
            size={16}
            style={{
              fontWeight: '600',
              lineHeight: 24
            }}
          >
            {t('ORDER_TIME', 'Order time')}
          </OText>
          <View style={{ flex: 1 }}>
            {selectDate && datesWhitelist[0].start !== null && (
              <CalendarStrip
                scrollable
                style={styles.calendar}
                calendarHeaderContainerStyle={styles.calendarHeaderContainer}
                calendarHeaderStyle={styles.calendarHeader}
                dateNumberStyle={styles.dateNumber}
                dateNameStyle={styles.dateName}
                iconContainer={{flex: 0.1}}
                highlightDateNameStyle={styles.highlightDateName}
                highlightDateNumberStyle={styles.highlightDateNumber}
                calendarHeaderFormat='MMMM, YYYY'
                iconStyle={{borderWidth: 1}}
                selectedDate={selectDate}
                datesWhitelist={datesWhitelist}
                disabledDateNameStyle={styles.disabledDateName}
                disabledDateNumberStyle={styles.disabledDateNumber}
                disabledDateOpacity={0.6}
                onDateSelected={(date) => onSelectDate(date)}
                leftSelector={<LeftSelector />}
                rightSelector={<RightSelector />}
              />
            )}
          </View>
          <TimeListWrapper nestedScrollEnabled={true}>
            <TimeContentWrapper>
              {timeList.map((time: any, i: number) => (
                <TouchableOpacity key={i} onPress={() => handleChangeTime(time.value)}>
                  <TimeItem active={timeSelected === time.value}>
                    <OText
                      size={14}
                      color={timeSelected === time.value ? theme.colors.primary: theme.colors.textNormal}
                      style={{
                        lineHeight: 24
                      }}
                    >{time.text}</OText>
                  </TimeItem>
                </TouchableOpacity>
              ))}
              {timeList.length % 3 === 2 && (
                <TimeItem style={{backgroundColor: 'transparent'}}/>
              )}
            </TimeContentWrapper>
          </TimeListWrapper>
        </OrderTimeWrapper>
        <OButton
          text={t('GO_TO_MENU', 'Go to menu')}
          textStyle={{color: 'white'}}
          style={{borderRadius: 7.6, marginBottom: 50, marginTop: 30}}
          onClick={() => handleClickBusiness()}
        />
      </PreOrderContainer>
      <Spinner visible={orderState.loading} />
      <OModal
        open={isPreorderTypeList}
        onClose={() => setIsPreorderTypeList(false)}
        customClose
        entireModal
      >
        <PreorderTypeListWrapper>
          <TouchableOpacity onPress={() => setIsPreorderTypeList(false)} style={{ marginBottom: 12 }}>
            <IconAntDesign
              name='close'
              color={theme.colors.textThird}
              size={24}
            />
          </TouchableOpacity>
          {preorderTypeList?.map((option: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleClickPreorderType(option)}
            >
              <DropOption
                numberOfLines={1}
                selected={option.key === selectedPreorderType.key}
              >
                <View style={{ marginRight: 10 }}>
                  {option.key === selectedPreorderType.key ? (
                    <MaterialCommunityIcons
                      name='radiobox-marked'
                      size={24}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name='radiobox-blank'
                      size={24}
                      color={theme.colors.arrowColor}
                    />
                  )}
                </View>
                <Text>{option.name}</Text>
              </DropOption>
            </TouchableOpacity>
          ))}
        </PreorderTypeListWrapper>
      </OModal>
    </>
  )
}

export const BusinessPreorder = (props: any) => {
  const [{ configs }] = useConfig()

  const limitDays = parseInt(configs?.max_days_preorder?.value, 10)

  const currentDate = new Date()
  const time = limitDays > 1
    ? currentDate.getTime() + ((limitDays - 1) * 24 * 60 * 60 * 1000)
    : limitDays === 1 ? currentDate.getTime() : currentDate.getTime() + (6 * 24 * 60 * 60 * 1000)

  currentDate.setTime(time)
  currentDate.setHours(23)
  currentDate.setMinutes(59)

  const businessPreorderProps = {
    ...props,
    UIComponent: BusinessPreorderUI,
    maxDate: currentDate
  }
  return <MomentOption {...businessPreorderProps} />
}