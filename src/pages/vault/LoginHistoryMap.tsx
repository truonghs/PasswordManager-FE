import { Map } from 'leaflet'
import { useNavigate } from 'react-router-dom'
import { message, Select, Skeleton } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'

import { useBoolean } from '@/hooks'
import { icons } from '@/utils/icons'
import { loginHistoryKeys } from '@/keys'
import { formatDateTime } from '@/utils/helpers'
import { CustomBtn, LoginHistoryItem } from '@/components'
import { ILoginHistoryResponse, IQueryLoginHistory } from '@/interfaces'
import { LOCAL_STORAGE_KEYS, PATH, TIME_FILTER_OPTIONS, TIME_FILTER_VALUE, TimeFilterValue } from '@/utils/constants'

export const LoginHistoryMap = () => {
  const navigate = useNavigate()

  const mapRef = useRef<Map | null>(null)

  const listLoginHistoriesRef = useRef<HTMLUListElement | null>(null)

  const [filterQuery, setFilterQuery] = useState<IQueryLoginHistory>({
    startDate: formatDateTime(TIME_FILTER_VALUE['3days']),
    endDate: formatDateTime(Date.now()),
    skip: 0
  })

  const [selectTime, setSelectTime] = useState<TimeFilterValue | string>('3days')

  const [selectTimeString, setSelectTimeString] = useState(`From ${filterQuery.startDate} to ${filterQuery.endDate}`)

  const [defaultLocation, setDefaultLocation] = useState<[number, number]>([51.505, -0.09])

  const [listLoginHistories, setListLoginHistories] = useState<ILoginHistoryResponse[]>([])

  const { value: showNavbar, toggle: toggleShowNavbar } = useBoolean(true)

  const {
    data: loginHistories,
    isFetching,
    isFetched,
    isLoading
  } = useQuery<ILoginHistoryResponse[]>({
    ...loginHistoryKeys.list(filterQuery),
    enabled: !!filterQuery.startDate && !!filterQuery.endDate && filterQuery?.skip >= 0
  })
  const requestLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setDefaultLocation([latitude, longitude])
        },
        () => {
          message.error('Location access denied')
        }
      )
    } else {
      message.warning('Geolocation is not supported by this browser.')
    }
  }

  const handleBackHome = () => {
    const savedPathname = localStorage.getItem(LOCAL_STORAGE_KEYS.pathName) || PATH.VAULT
    navigate(savedPathname)
  }

  const handleFilter = () => {
    setFilterQuery({
      startDate: formatDateTime(TIME_FILTER_VALUE[selectTime as TimeFilterValue]),
      endDate: formatDateTime(Date.now()),
      skip: 0
    })
    const listContainer = listLoginHistoriesRef.current
    if (!listContainer) return
    listContainer.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const listContainer = listLoginHistoriesRef.current
    if (!listContainer) return

    const handleScroll = () => {
      const scrollTop = listContainer.scrollTop
      const scrollHeight = listContainer.scrollHeight
      const clientHeight = listContainer.clientHeight

      if (scrollHeight - scrollTop <= clientHeight + 100) {
        if (loginHistories && loginHistories?.length > 0) {
          setFilterQuery((prevFilter) => ({
            ...prevFilter,
            skip: prevFilter.skip + 10
          }))
        }
      }
    }

    listContainer.addEventListener('scroll', handleScroll)

    return () => {
      listContainer.removeEventListener('scroll', handleScroll)
    }
  }, [listLoginHistories, filterQuery])

  useEffect(() => {
    if (loginHistories && loginHistories?.length > 0) {
      if (filterQuery.skip === 0) {
        setListLoginHistories(loginHistories)
      } else {
        setListLoginHistories((prevHistories) => [...prevHistories, ...loginHistories])
      }
      if (mapRef.current) mapRef.current.setView([loginHistories[0].lat, loginHistories[0].lon])
      setDefaultLocation([loginHistories[0].lat, loginHistories[0]?.lon])
    } else {
      requestLocation()
    }
  }, [loginHistories, filterQuery.skip])

  useEffect(() => {
    setSelectTimeString(
      `From ${formatDateTime(TIME_FILTER_VALUE[selectTime as TimeFilterValue])} to ${formatDateTime(Date.now())}`
    )
  }, [selectTime])

  return (
    <section className='flex w-full h-screen'>
      <nav
        className={`absolute top-0 bottom-0 left-0 h-screen md:w-[470px] xs:w-full overflow-hidden z-[401] transition duration-400 ${showNavbar ? 'translate-x-0' : 'md:-translate-x-[448px] xs:-translate-x-[90%]'}`}
      >
        <div className='absolute flex flex-col top-0 bottom-0 left-0 h-full md:w-[448px] xs:w-[90%] bg-white shadow-right'>
          <div className='p-4 flex xs:flex-wrap md:flex-nowrap items-center gap-x-4 xs:justify-between md:justify-start'>
            <Select
              value={selectTimeString}
              onChange={setSelectTime}
              className='md:w-full xs:w-fit h-12'
              placeholder='Select type'
              options={TIME_FILTER_OPTIONS}
            />

            <CustomBtn
              type='primary'
              onClick={handleFilter}
              children={<span>{icons.search}</span>}
              className='md:mt-0 xs:mt-2 !w-fit'
            />
          </div>
          <ul
            ref={listLoginHistoriesRef}
            className='space-y-4 xs:h-[70%] md:h-[84%] lg:h-[82%]  2xl:h-[84%] overflow-y-auto scroll-container'
          >
            {isLoading && isFetched && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <li key={index} className='p-4 border-b border-gray-200'>
                    <Skeleton active title paragraph={{ rows: 2 }} />
                  </li>
                ))}
              </>
            )}
            {listLoginHistories.length > 0
              ? listLoginHistories.map((loginHistory) => (
                  <LoginHistoryItem key={loginHistory.id} loginHistory={loginHistory} />
                ))
              : !isFetching &&
                listLoginHistories.length === 0 && (
                  <li className='text-lg text-center py-10'>No login history found!</li>
                )}
            {isFetching && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <li key={index} className='p-4 border-b border-gray-200'>
                    <Skeleton active title paragraph={{ rows: 2 }} />
                  </li>
                ))}
              </>
            )}
          </ul>
          <div className='flex items-center xs:mx-2 mb-2'>
            <CustomBtn title='Back' type='primary' onClick={handleBackHome} className='mt-4' />
          </div>
        </div>
        <div className='absolute top-1/2 md:left-[449px] xs:left-[90%] md:block w-6 h-12 bg-white rounded-r-xl'>
          <button className='w-full h-full' onClick={toggleShowNavbar}>
            <span className='text-center text-2xl'>{showNavbar ? icons.arrowDropleft : icons.arrowDropright}</span>
          </button>
        </div>
      </nav>
      <MapContainer
        ref={mapRef}
        center={defaultLocation}
        zoom={13}
        scrollWheelZoom={false}
        className='w-full h-screen'
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {listLoginHistories.length > 0 ? (
          listLoginHistories.map((loginHistory) => (
            <Marker key={loginHistory.id} position={[loginHistory.lat, loginHistory.lon]} icon={icons.locationOpenStreetMap}>
              <Popup>{loginHistory.address}</Popup>
            </Marker>
          ))
        ) : (
          <Marker position={defaultLocation}>
            <Popup>Your current position</Popup>
          </Marker>
        )}
        <ZoomControl position='bottomright' />
      </MapContainer>
    </section>
  )
}
