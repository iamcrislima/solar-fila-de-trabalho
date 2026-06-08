import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Icon } from '.';

// ─── Filled ──────────────────────────────────────────────────────────────────
import Home from '@mui/icons-material/Home';
import Search from '@mui/icons-material/Search';
import Menu from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';
import Check from '@mui/icons-material/Check';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Save from '@mui/icons-material/Save';
import Download from '@mui/icons-material/Download';
import Upload from '@mui/icons-material/Upload';
import Share from '@mui/icons-material/Share';
import Print from '@mui/icons-material/Print';
import Settings from '@mui/icons-material/Settings';
import Notifications from '@mui/icons-material/Notifications';
import Person from '@mui/icons-material/Person';
import Group from '@mui/icons-material/Group';
import Email from '@mui/icons-material/Email';
import Phone from '@mui/icons-material/Phone';
import Chat from '@mui/icons-material/Chat';
import VideoCall from '@mui/icons-material/VideoCall';
import LocationOn from '@mui/icons-material/LocationOn';
import Map from '@mui/icons-material/Map';
import Navigation from '@mui/icons-material/Navigation';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import MoreVert from '@mui/icons-material/MoreVert';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Refresh from '@mui/icons-material/Refresh';
import FilterList from '@mui/icons-material/FilterList';
import Sort from '@mui/icons-material/Sort';
import Star from '@mui/icons-material/Star';
import Favorite from '@mui/icons-material/Favorite';
import Bookmark from '@mui/icons-material/Bookmark';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Lock from '@mui/icons-material/Lock';
import LockOpen from '@mui/icons-material/LockOpen';
import Info from '@mui/icons-material/Info';
import Warning from '@mui/icons-material/Warning';
import Error from '@mui/icons-material/Error';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Help from '@mui/icons-material/Help';
import CalendarToday from '@mui/icons-material/CalendarToday';
import Schedule from '@mui/icons-material/Schedule';
import Event from '@mui/icons-material/Event';
import Dashboard from '@mui/icons-material/Dashboard';
import List from '@mui/icons-material/List';
import GridView from '@mui/icons-material/GridView';
import TableChart from '@mui/icons-material/TableChart';
import BarChart from '@mui/icons-material/BarChart';
import PieChart from '@mui/icons-material/PieChart';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Receipt from '@mui/icons-material/Receipt';
import CreditCard from '@mui/icons-material/CreditCard';
import AccountBalance from '@mui/icons-material/AccountBalance';
import Folder from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';
import Description from '@mui/icons-material/Description';
import Article from '@mui/icons-material/Article';
import Image from '@mui/icons-material/Image';
import Videocam from '@mui/icons-material/Videocam';
import Mic from '@mui/icons-material/Mic';
import AttachFile from '@mui/icons-material/AttachFile';
import Link from '@mui/icons-material/Link';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Undo from '@mui/icons-material/Undo';
import Redo from '@mui/icons-material/Redo';
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Launch from '@mui/icons-material/Launch';
import Build from '@mui/icons-material/Build';
import Tune from '@mui/icons-material/Tune';
import Flag from '@mui/icons-material/Flag';
import Label from '@mui/icons-material/Label';
import Tag from '@mui/icons-material/Tag';
import Business from '@mui/icons-material/Business';
import Store from '@mui/icons-material/Store';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Assignment from '@mui/icons-material/Assignment';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';
import Task from '@mui/icons-material/Task';
import CheckBox from '@mui/icons-material/CheckBox';
import RadioButtonChecked from '@mui/icons-material/RadioButtonChecked';
import ToggleOn from '@mui/icons-material/ToggleOn';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import Security from '@mui/icons-material/Security';

// ─── Outlined ────────────────────────────────────────────────────────────────
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import MenuOutlined from '@mui/icons-material/MenuOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import UploadOutlined from '@mui/icons-material/UploadOutlined';
import ShareOutlined from '@mui/icons-material/ShareOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import ChatOutlined from '@mui/icons-material/ChatOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import RefreshOutlined from '@mui/icons-material/RefreshOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import StarOutlined from '@mui/icons-material/StarOutlined';
import FavoriteOutlined from '@mui/icons-material/FavoriteOutlined';
import BookmarkOutlined from '@mui/icons-material/BookmarkOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import WarningOutlined from '@mui/icons-material/WarningOutlined';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import HelpOutlined from '@mui/icons-material/HelpOutlined';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import TableChartOutlined from '@mui/icons-material/TableChartOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined';
import ReceiptOutlined from '@mui/icons-material/ReceiptOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import FolderOpenOutlined from '@mui/icons-material/FolderOpenOutlined';
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import VideocamOutlined from '@mui/icons-material/VideocamOutlined';
import MicOutlined from '@mui/icons-material/MicOutlined';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import BuildOutlined from '@mui/icons-material/BuildOutlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import LabelOutlined from '@mui/icons-material/LabelOutlined';
import BusinessOutlined from '@mui/icons-material/BusinessOutlined';
import StoreOutlined from '@mui/icons-material/StoreOutlined';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import AssignmentTurnedInOutlined from '@mui/icons-material/AssignmentTurnedInOutlined';
import TaskOutlined from '@mui/icons-material/TaskOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';

// ─── Rounded ─────────────────────────────────────────────────────────────────
import HomeRounded from '@mui/icons-material/HomeRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import NotificationsRounded from '@mui/icons-material/NotificationsRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import EmailRounded from '@mui/icons-material/EmailRounded';
import PhoneRounded from '@mui/icons-material/PhoneRounded';
import LocationOnRounded from '@mui/icons-material/LocationOnRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import FavoriteRounded from '@mui/icons-material/FavoriteRounded';
import BookmarkRounded from '@mui/icons-material/BookmarkRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import InfoRounded from '@mui/icons-material/InfoRounded';
import WarningRounded from '@mui/icons-material/WarningRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import HelpRounded from '@mui/icons-material/HelpRounded';
import CalendarTodayRounded from '@mui/icons-material/CalendarTodayRounded';
import DashboardRounded from '@mui/icons-material/DashboardRounded';
import FolderRounded from '@mui/icons-material/FolderRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import ImageRounded from '@mui/icons-material/ImageRounded';
import BuildRounded from '@mui/icons-material/BuildRounded';
import FlagRounded from '@mui/icons-material/FlagRounded';
import BusinessRounded from '@mui/icons-material/BusinessRounded';
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded';
import AssignmentRounded from '@mui/icons-material/AssignmentRounded';
import SecurityRounded from '@mui/icons-material/SecurityRounded';

// ─── Sharp ───────────────────────────────────────────────────────────────────
import HomeSharp from '@mui/icons-material/HomeSharp';
import SearchSharp from '@mui/icons-material/SearchSharp';
import MenuSharp from '@mui/icons-material/MenuSharp';
import CloseSharp from '@mui/icons-material/CloseSharp';
import CheckSharp from '@mui/icons-material/CheckSharp';
import AddSharp from '@mui/icons-material/AddSharp';
import EditSharp from '@mui/icons-material/EditSharp';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
import SettingsSharp from '@mui/icons-material/SettingsSharp';
import NotificationsSharp from '@mui/icons-material/NotificationsSharp';
import PersonSharp from '@mui/icons-material/PersonSharp';
import EmailSharp from '@mui/icons-material/EmailSharp';
import LocationOnSharp from '@mui/icons-material/LocationOnSharp';
import StarSharp from '@mui/icons-material/StarSharp';
import FavoriteSharp from '@mui/icons-material/FavoriteSharp';
import LockSharp from '@mui/icons-material/LockSharp';
import InfoSharp from '@mui/icons-material/InfoSharp';
import WarningSharp from '@mui/icons-material/WarningSharp';
import CheckCircleSharp from '@mui/icons-material/CheckCircleSharp';
import DashboardSharp from '@mui/icons-material/DashboardSharp';
import FolderSharp from '@mui/icons-material/FolderSharp';
import DescriptionSharp from '@mui/icons-material/DescriptionSharp';
import BuildSharp from '@mui/icons-material/BuildSharp';
import BusinessSharp from '@mui/icons-material/BusinessSharp';
import ShoppingCartSharp from '@mui/icons-material/ShoppingCartSharp';
import AssignmentSharp from '@mui/icons-material/AssignmentSharp';

// ─── TwoTone ─────────────────────────────────────────────────────────────────
import HomeTwoTone from '@mui/icons-material/HomeTwoTone';
import SearchTwoTone from '@mui/icons-material/SearchTwoTone';
import EditTwoTone from '@mui/icons-material/EditTwoTone';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import SettingsTwoTone from '@mui/icons-material/SettingsTwoTone';
import NotificationsTwoTone from '@mui/icons-material/NotificationsTwoTone';
import PersonTwoTone from '@mui/icons-material/PersonTwoTone';
import EmailTwoTone from '@mui/icons-material/EmailTwoTone';
import LocationOnTwoTone from '@mui/icons-material/LocationOnTwoTone';
import StarTwoTone from '@mui/icons-material/StarTwoTone';
import FavoriteTwoTone from '@mui/icons-material/FavoriteTwoTone';
import LockTwoTone from '@mui/icons-material/LockTwoTone';
import InfoTwoTone from '@mui/icons-material/InfoTwoTone';
import WarningTwoTone from '@mui/icons-material/WarningTwoTone';
import CheckCircleTwoTone from '@mui/icons-material/CheckCircleTwoTone';
import DashboardTwoTone from '@mui/icons-material/DashboardTwoTone';
import FolderTwoTone from '@mui/icons-material/FolderTwoTone';
import DescriptionTwoTone from '@mui/icons-material/DescriptionTwoTone';
import BuildTwoTone from '@mui/icons-material/BuildTwoTone';
import BusinessTwoTone from '@mui/icons-material/BusinessTwoTone';
import ShoppingCartTwoTone from '@mui/icons-material/ShoppingCartTwoTone';
import AssignmentTwoTone from '@mui/icons-material/AssignmentTwoTone';

// ─── Registry ────────────────────────────────────────────────────────────────

const VARIANTS = {
  Filled: [
    { name: 'Home', component: Home },
    { name: 'Search', component: Search },
    { name: 'Menu', component: Menu },
    { name: 'Close', component: Close },
    { name: 'Check', component: Check },
    { name: 'Add', component: Add },
    { name: 'Remove', component: Remove },
    { name: 'Edit', component: Edit },
    { name: 'Delete', component: Delete },
    { name: 'Save', component: Save },
    { name: 'Download', component: Download },
    { name: 'Upload', component: Upload },
    { name: 'Share', component: Share },
    { name: 'Print', component: Print },
    { name: 'Settings', component: Settings },
    { name: 'Notifications', component: Notifications },
    { name: 'Person', component: Person },
    { name: 'Group', component: Group },
    { name: 'Email', component: Email },
    { name: 'Phone', component: Phone },
    { name: 'Chat', component: Chat },
    { name: 'VideoCall', component: VideoCall },
    { name: 'LocationOn', component: LocationOn },
    { name: 'Map', component: Map },
    { name: 'Navigation', component: Navigation },
    { name: 'ArrowBack', component: ArrowBack },
    { name: 'ArrowForward', component: ArrowForward },
    { name: 'ArrowUpward', component: ArrowUpward },
    { name: 'ArrowDownward', component: ArrowDownward },
    { name: 'ChevronLeft', component: ChevronLeft },
    { name: 'ChevronRight', component: ChevronRight },
    { name: 'ExpandMore', component: ExpandMore },
    { name: 'ExpandLess', component: ExpandLess },
    { name: 'MoreVert', component: MoreVert },
    { name: 'MoreHoriz', component: MoreHoriz },
    { name: 'Refresh', component: Refresh },
    { name: 'FilterList', component: FilterList },
    { name: 'Sort', component: Sort },
    { name: 'Star', component: Star },
    { name: 'Favorite', component: Favorite },
    { name: 'Bookmark', component: Bookmark },
    { name: 'Visibility', component: Visibility },
    { name: 'VisibilityOff', component: VisibilityOff },
    { name: 'Lock', component: Lock },
    { name: 'LockOpen', component: LockOpen },
    { name: 'Info', component: Info },
    { name: 'Warning', component: Warning },
    { name: 'Error', component: Error },
    { name: 'CheckCircle', component: CheckCircle },
    { name: 'Help', component: Help },
    { name: 'CalendarToday', component: CalendarToday },
    { name: 'Schedule', component: Schedule },
    { name: 'Event', component: Event },
    { name: 'Dashboard', component: Dashboard },
    { name: 'List', component: List },
    { name: 'GridView', component: GridView },
    { name: 'TableChart', component: TableChart },
    { name: 'BarChart', component: BarChart },
    { name: 'PieChart', component: PieChart },
    { name: 'TrendingUp', component: TrendingUp },
    { name: 'TrendingDown', component: TrendingDown },
    { name: 'AttachMoney', component: AttachMoney },
    { name: 'Receipt', component: Receipt },
    { name: 'CreditCard', component: CreditCard },
    { name: 'AccountBalance', component: AccountBalance },
    { name: 'Folder', component: Folder },
    { name: 'FolderOpen', component: FolderOpen },
    { name: 'InsertDriveFile', component: InsertDriveFile },
    { name: 'Description', component: Description },
    { name: 'Article', component: Article },
    { name: 'Image', component: Image },
    { name: 'Videocam', component: Videocam },
    { name: 'Mic', component: Mic },
    { name: 'AttachFile', component: AttachFile },
    { name: 'Link', component: Link },
    { name: 'ContentCopy', component: ContentCopy },
    { name: 'ContentPaste', component: ContentPaste },
    { name: 'Undo', component: Undo },
    { name: 'Redo', component: Redo },
    { name: 'ZoomIn', component: ZoomIn },
    { name: 'ZoomOut', component: ZoomOut },
    { name: 'Fullscreen', component: Fullscreen },
    { name: 'FullscreenExit', component: FullscreenExit },
    { name: 'OpenInNew', component: OpenInNew },
    { name: 'Launch', component: Launch },
    { name: 'Build', component: Build },
    { name: 'Tune', component: Tune },
    { name: 'Flag', component: Flag },
    { name: 'Label', component: Label },
    { name: 'Tag', component: Tag },
    { name: 'Business', component: Business },
    { name: 'Store', component: Store },
    { name: 'ShoppingCart', component: ShoppingCart },
    { name: 'LocalShipping', component: LocalShipping },
    { name: 'Assignment', component: Assignment },
    { name: 'AssignmentTurnedIn', component: AssignmentTurnedIn },
    { name: 'Task', component: Task },
    { name: 'CheckBox', component: CheckBox },
    { name: 'RadioButtonChecked', component: RadioButtonChecked },
    { name: 'ToggleOn', component: ToggleOn },
    { name: 'Logout', component: Logout },
    { name: 'Login', component: Login },
    { name: 'AdminPanelSettings', component: AdminPanelSettings },
    { name: 'Security', component: Security },
  ],
  Outlined: [
    { name: 'HomeOutlined', component: HomeOutlined },
    { name: 'SearchOutlined', component: SearchOutlined },
    { name: 'MenuOutlined', component: MenuOutlined },
    { name: 'CloseOutlined', component: CloseOutlined },
    { name: 'CheckOutlined', component: CheckOutlined },
    { name: 'AddOutlined', component: AddOutlined },
    { name: 'EditOutlined', component: EditOutlined },
    { name: 'DeleteOutlined', component: DeleteOutlined },
    { name: 'SaveOutlined', component: SaveOutlined },
    { name: 'DownloadOutlined', component: DownloadOutlined },
    { name: 'UploadOutlined', component: UploadOutlined },
    { name: 'ShareOutlined', component: ShareOutlined },
    { name: 'SettingsOutlined', component: SettingsOutlined },
    { name: 'NotificationsOutlined', component: NotificationsOutlined },
    { name: 'PersonOutlined', component: PersonOutlined },
    { name: 'GroupOutlined', component: GroupOutlined },
    { name: 'EmailOutlined', component: EmailOutlined },
    { name: 'PhoneOutlined', component: PhoneOutlined },
    { name: 'ChatOutlined', component: ChatOutlined },
    { name: 'LocationOnOutlined', component: LocationOnOutlined },
    { name: 'ArrowBackOutlined', component: ArrowBackOutlined },
    { name: 'ArrowForwardOutlined', component: ArrowForwardOutlined },
    { name: 'RefreshOutlined', component: RefreshOutlined },
    { name: 'FilterListOutlined', component: FilterListOutlined },
    { name: 'StarOutlined', component: StarOutlined },
    { name: 'FavoriteOutlined', component: FavoriteOutlined },
    { name: 'BookmarkOutlined', component: BookmarkOutlined },
    { name: 'VisibilityOutlined', component: VisibilityOutlined },
    { name: 'VisibilityOffOutlined', component: VisibilityOffOutlined },
    { name: 'LockOutlined', component: LockOutlined },
    { name: 'InfoOutlined', component: InfoOutlined },
    { name: 'WarningOutlined', component: WarningOutlined },
    { name: 'ErrorOutlined', component: ErrorOutlined },
    { name: 'CheckCircleOutlined', component: CheckCircleOutlined },
    { name: 'HelpOutlined', component: HelpOutlined },
    { name: 'CalendarTodayOutlined', component: CalendarTodayOutlined },
    { name: 'ScheduleOutlined', component: ScheduleOutlined },
    { name: 'EventOutlined', component: EventOutlined },
    { name: 'DashboardOutlined', component: DashboardOutlined },
    { name: 'TableChartOutlined', component: TableChartOutlined },
    { name: 'BarChartOutlined', component: BarChartOutlined },
    { name: 'TrendingUpOutlined', component: TrendingUpOutlined },
    { name: 'AttachMoneyOutlined', component: AttachMoneyOutlined },
    { name: 'ReceiptOutlined', component: ReceiptOutlined },
    { name: 'CreditCardOutlined', component: CreditCardOutlined },
    { name: 'AccountBalanceOutlined', component: AccountBalanceOutlined },
    { name: 'FolderOutlined', component: FolderOutlined },
    { name: 'FolderOpenOutlined', component: FolderOpenOutlined },
    { name: 'InsertDriveFileOutlined', component: InsertDriveFileOutlined },
    { name: 'DescriptionOutlined', component: DescriptionOutlined },
    { name: 'ArticleOutlined', component: ArticleOutlined },
    { name: 'ImageOutlined', component: ImageOutlined },
    { name: 'VideocamOutlined', component: VideocamOutlined },
    { name: 'MicOutlined', component: MicOutlined },
    { name: 'AttachFileOutlined', component: AttachFileOutlined },
    { name: 'LinkOutlined', component: LinkOutlined },
    { name: 'ContentCopyOutlined', component: ContentCopyOutlined },
    { name: 'BuildOutlined', component: BuildOutlined },
    { name: 'TuneOutlined', component: TuneOutlined },
    { name: 'FlagOutlined', component: FlagOutlined },
    { name: 'LabelOutlined', component: LabelOutlined },
    { name: 'BusinessOutlined', component: BusinessOutlined },
    { name: 'StoreOutlined', component: StoreOutlined },
    { name: 'ShoppingCartOutlined', component: ShoppingCartOutlined },
    { name: 'LocalShippingOutlined', component: LocalShippingOutlined },
    { name: 'AssignmentOutlined', component: AssignmentOutlined },
    { name: 'AssignmentTurnedInOutlined', component: AssignmentTurnedInOutlined },
    { name: 'TaskOutlined', component: TaskOutlined },
    { name: 'LogoutOutlined', component: LogoutOutlined },
    { name: 'LoginOutlined', component: LoginOutlined },
    { name: 'AdminPanelSettingsOutlined', component: AdminPanelSettingsOutlined },
    { name: 'SecurityOutlined', component: SecurityOutlined },
  ],
  Rounded: [
    { name: 'HomeRounded', component: HomeRounded },
    { name: 'SearchRounded', component: SearchRounded },
    { name: 'MenuRounded', component: MenuRounded },
    { name: 'CloseRounded', component: CloseRounded },
    { name: 'CheckRounded', component: CheckRounded },
    { name: 'AddRounded', component: AddRounded },
    { name: 'EditRounded', component: EditRounded },
    { name: 'DeleteRounded', component: DeleteRounded },
    { name: 'SaveRounded', component: SaveRounded },
    { name: 'SettingsRounded', component: SettingsRounded },
    { name: 'NotificationsRounded', component: NotificationsRounded },
    { name: 'PersonRounded', component: PersonRounded },
    { name: 'EmailRounded', component: EmailRounded },
    { name: 'PhoneRounded', component: PhoneRounded },
    { name: 'LocationOnRounded', component: LocationOnRounded },
    { name: 'StarRounded', component: StarRounded },
    { name: 'FavoriteRounded', component: FavoriteRounded },
    { name: 'BookmarkRounded', component: BookmarkRounded },
    { name: 'LockRounded', component: LockRounded },
    { name: 'InfoRounded', component: InfoRounded },
    { name: 'WarningRounded', component: WarningRounded },
    { name: 'CheckCircleRounded', component: CheckCircleRounded },
    { name: 'HelpRounded', component: HelpRounded },
    { name: 'CalendarTodayRounded', component: CalendarTodayRounded },
    { name: 'DashboardRounded', component: DashboardRounded },
    { name: 'FolderRounded', component: FolderRounded },
    { name: 'DescriptionRounded', component: DescriptionRounded },
    { name: 'ImageRounded', component: ImageRounded },
    { name: 'BuildRounded', component: BuildRounded },
    { name: 'FlagRounded', component: FlagRounded },
    { name: 'BusinessRounded', component: BusinessRounded },
    { name: 'ShoppingCartRounded', component: ShoppingCartRounded },
    { name: 'AssignmentRounded', component: AssignmentRounded },
    { name: 'SecurityRounded', component: SecurityRounded },
  ],
  Sharp: [
    { name: 'HomeSharp', component: HomeSharp },
    { name: 'SearchSharp', component: SearchSharp },
    { name: 'MenuSharp', component: MenuSharp },
    { name: 'CloseSharp', component: CloseSharp },
    { name: 'CheckSharp', component: CheckSharp },
    { name: 'AddSharp', component: AddSharp },
    { name: 'EditSharp', component: EditSharp },
    { name: 'DeleteSharp', component: DeleteSharp },
    { name: 'SettingsSharp', component: SettingsSharp },
    { name: 'NotificationsSharp', component: NotificationsSharp },
    { name: 'PersonSharp', component: PersonSharp },
    { name: 'EmailSharp', component: EmailSharp },
    { name: 'LocationOnSharp', component: LocationOnSharp },
    { name: 'StarSharp', component: StarSharp },
    { name: 'FavoriteSharp', component: FavoriteSharp },
    { name: 'LockSharp', component: LockSharp },
    { name: 'InfoSharp', component: InfoSharp },
    { name: 'WarningSharp', component: WarningSharp },
    { name: 'CheckCircleSharp', component: CheckCircleSharp },
    { name: 'DashboardSharp', component: DashboardSharp },
    { name: 'FolderSharp', component: FolderSharp },
    { name: 'DescriptionSharp', component: DescriptionSharp },
    { name: 'BuildSharp', component: BuildSharp },
    { name: 'BusinessSharp', component: BusinessSharp },
    { name: 'ShoppingCartSharp', component: ShoppingCartSharp },
    { name: 'AssignmentSharp', component: AssignmentSharp },
  ],
  TwoTone: [
    { name: 'HomeTwoTone', component: HomeTwoTone },
    { name: 'SearchTwoTone', component: SearchTwoTone },
    { name: 'EditTwoTone', component: EditTwoTone },
    { name: 'DeleteTwoTone', component: DeleteTwoTone },
    { name: 'SettingsTwoTone', component: SettingsTwoTone },
    { name: 'NotificationsTwoTone', component: NotificationsTwoTone },
    { name: 'PersonTwoTone', component: PersonTwoTone },
    { name: 'EmailTwoTone', component: EmailTwoTone },
    { name: 'LocationOnTwoTone', component: LocationOnTwoTone },
    { name: 'StarTwoTone', component: StarTwoTone },
    { name: 'FavoriteTwoTone', component: FavoriteTwoTone },
    { name: 'LockTwoTone', component: LockTwoTone },
    { name: 'InfoTwoTone', component: InfoTwoTone },
    { name: 'WarningTwoTone', component: WarningTwoTone },
    { name: 'CheckCircleTwoTone', component: CheckCircleTwoTone },
    { name: 'DashboardTwoTone', component: DashboardTwoTone },
    { name: 'FolderTwoTone', component: FolderTwoTone },
    { name: 'DescriptionTwoTone', component: DescriptionTwoTone },
    { name: 'BuildTwoTone', component: BuildTwoTone },
    { name: 'BusinessTwoTone', component: BusinessTwoTone },
    { name: 'ShoppingCartTwoTone', component: ShoppingCartTwoTone },
    { name: 'AssignmentTwoTone', component: AssignmentTwoTone },
  ],
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const S: {
  page: CSSProperties;
  toolbar: CSSProperties;
  input: CSSProperties;
  tabs: CSSProperties;
  tab: (active: boolean) => CSSProperties;
  grid: CSSProperties;
  cell: CSSProperties;
  cellLabel: CSSProperties;
  usageBox: CSSProperties;
} = {
  page:        { padding: 32, backgroundColor: '#FAFAFA', minHeight: '100vh' },
  toolbar:     { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' },
  input:       { padding: '8px 12px', border: '1px solid #9E9E9E', borderRadius: 4, fontFamily: "'Open Sans', sans-serif", fontSize: 14, width: 240, outline: 'none' },
  tabs:        { display: 'flex', gap: 8 },
  tab:         (active: boolean) => ({ padding: '6px 16px', borderRadius: 4, border: 'none', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 600, backgroundColor: active ? '#006064' : '#E0E0E0', color: active ? '#fff' : '#616161' }),
  grid:        { display: 'flex', flexWrap: 'wrap', gap: 8 },
  cell:        { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 12, borderRadius: 8, backgroundColor: '#FFFFFF', width: 100, cursor: 'default' },
  cellLabel:   { fontFamily: 'monospace', fontSize: 9, color: '#9E9E9E', textAlign: 'center', wordBreak: 'break-all', lineHeight: 1.3 },
  usageBox:    { backgroundColor: '#212121', borderRadius: 8, padding: '16px 20px', marginBottom: 32, fontFamily: 'monospace', fontSize: 13, color: '#B2EBF2', lineHeight: 1.8 },
};

// ─── Stories ─────────────────────────────────────────────────────────────────

export default {
  title: '00-Foundations/Icons',
  parameters: { layout: 'padded' },
};

export const GaleriaDeIcones = () => {
  const [query, setQuery]     = useState('');
  const [variant, setVariant] = useState('Outlined');

  const icons = VARIANTS[variant as keyof typeof VARIANTS] ?? [];
  const filtered = query
    ? icons.filter((i: { name: string }) => i.name.toLowerCase().includes(query.toLowerCase()))
    : icons;

  return (
    <div style={S.page}>
      <div style={S.usageBox}>
        <div>{'// Como usar qualquer ícone:'}</div>
        <div>{"import HomeOutlined from '@mui/icons-material/HomeOutlined';"}</div>
        <div>{"import { Icon } from '../components/atoms/Icon';"}</div>
        <div>{''}</div>
        <div>{'<Icon component={HomeOutlined} size="md" color="#006064" />'}</div>
        <div>{''}</div>
        <div>{'// Tamanhos disponíveis: xs(16) | sm(20) | md(24) | lg(32) | xl(40)'}</div>
      </div>

      <div style={S.toolbar}>
        <div style={S.tabs}>
          {Object.keys(VARIANTS).map(v => (
            <button key={v} style={S.tab(variant === v)} onClick={() => setVariant(v)}>{v}</button>
          ))}
        </div>
        <input
          style={S.input}
          placeholder="Buscar ícone..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#9E9E9E' }}>
          {filtered.length} ícones
        </span>
      </div>

      <div style={S.grid}>
        {filtered.map(({ name, component }) => (
          <div key={name} style={S.cell} title={name}>
            <Icon component={component} size="md" color="#212121" />
            <span style={S.cellLabel}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

GaleriaDeIcones.storyName = 'Galeria de ícones';

export const Tamanhos = () => (
  <div style={S.page}>
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Icon component={HomeOutlined} size={size} color="#006064" />
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' }}>
            {size} ({({ xs: 16, sm: 20, md: 24, lg: 32, xl: 40 })[size]}px)
          </span>
        </div>
      ))}
    </div>
  </div>
);

Tamanhos.storyName = 'Tamanhos';
