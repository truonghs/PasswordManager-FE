import L from 'leaflet'
import {
  CloudOutlined,
  SafetyOutlined,
  UserSwitchOutlined,
  ToolOutlined,
  DashboardOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons'
import { BiSolidUserAccount } from 'react-icons/bi'
import { FaCopy, FaRegBell, FaUserCircle, FaUsers } from 'react-icons/fa'
import { TbLayoutDashboardFilled } from 'react-icons/tb'
import { IoLogOut, IoSettingsSharp, IoMenu, IoSearch, IoSettingsOutline } from 'react-icons/io5'
import { LuActivity, LuClock7, LuEye, LuEyeOff } from 'react-icons/lu'
import { TiDeviceTablet } from 'react-icons/ti'
import {
  MdCheck,
  MdFolder,
  MdFolderShared,
  MdLockPerson,
  MdOutlineLocationOn,
  MdOutlineRestorePage,
  MdOutlineWorkspaces,
  MdWorkspacesFilled
} from 'react-icons/md'
import { IoMdArrowDropdown, IoMdArrowDropleft, IoMdArrowDropright, IoMdCheckmark, IoMdClose } from 'react-icons/io'
import {
  RiFilterOffLine,
  RiLock2Line,
  RiLock2Fill,
  RiContactsBook2Line,
  RiContactsBook2Fill,
  RiFilterLine,
  RiHistoryFill,
  RiAccountCircleLine,
  RiAccountCircleFill
} from 'react-icons/ri'
import { PiShareFat, PiTrash, PiTrashFill } from 'react-icons/pi'
import { TfiMoreAlt } from 'react-icons/tfi'
import { CiVault } from 'react-icons/ci'
import { IoWarning } from 'react-icons/io5'
import { RxCounterClockwiseClock } from 'react-icons/rx'
import { FiMoreVertical } from 'react-icons/fi'

import locationImage from '@/assets/images/marker-icon.png'

const locationOpenStreetMap = L.icon({
  iconUrl: locationImage,
  iconSize: [25, 41],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
})

export const icons = {
  userCircle: <FaUserCircle />,
  dashboard: <TbLayoutDashboardFilled />,
  users: <FaUsers />,
  userAccount: <BiSolidUserAccount />,
  profileLine: <RiAccountCircleLine />,
  profileFill: <RiAccountCircleFill />,
  checkmark: <IoMdCheckmark />,
  close: <IoMdClose />,
  logout: <IoLogOut />,
  settings: <IoSettingsSharp />,
  menu: <IoMenu />,
  cloud: <CloudOutlined />,
  safety: <SafetyOutlined />,
  userSwitch: <UserSwitchOutlined />,
  tool: <ToolOutlined />,
  lockLine: <RiLock2Line />,
  lockFill: <RiLock2Fill />,
  lockShared: <MdLockPerson />,
  antDashboard: <DashboardOutlined />,
  facebook: <FacebookOutlined />,
  twitter: <TwitterOutlined />,
  instagram: <InstagramOutlined />,
  linkedin: <LinkedinOutlined />,
  arrowDropright: <IoMdArrowDropright />,
  arrowDropleft: <IoMdArrowDropleft />,
  locationSharp: <MdOutlineLocationOn />,
  outlineDevicesOther: <TiDeviceTablet />,
  clockFill: <LuClock7 />,
  workspaceLine: <MdOutlineWorkspaces />,
  workspaceFill: <MdWorkspacesFilled />,
  contactLine: <RiContactsBook2Line />,
  contactFill: <RiContactsBook2Fill />,
  add: <PlusOutlined />,
  share: <PiShareFat />,
  edit: <EditOutlined />,
  trash: <DeleteOutlined />,
  copy: <FaCopy />,
  moreAlt: <TfiMoreAlt />,
  filterOn: <RiFilterLine />,
  filterOff: <RiFilterOffLine />,
  check: <MdCheck />,
  arrowDropdown: <IoMdArrowDropdown />,
  folder: <MdFolder />,
  folderShared: <MdFolderShared />,
  history: <RiHistoryFill />,
  search: <IoSearch />,
  trashLine: <PiTrash />,
  trashFill: <PiTrashFill />,
  settingLine: <IoSettingsOutline />,
  settingFill: <IoSettingsSharp />,
  vaultLine: <CiVault />,
  warning: <IoWarning />,
  bell: <FaRegBell />,
  version: <RxCounterClockwiseClock />,
  activity: <LuActivity />,
  moreFi: <FiMoreVertical />,
  restore: <MdOutlineRestorePage />,
  eye: <LuEye />,
  eyeOff: <LuEyeOff />,
  locationOpenStreetMap
}
