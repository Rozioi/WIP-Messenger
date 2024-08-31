import logo from './assets/images/logo.svg';
import './assets/styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Main from "./page/Main";
import Layout from "./component/layout";
import ChatList from "./component/chatList";
import ChatDetail from "./component/ChatDetail";
import Authentication from "./page/authentication";
import { AuthProvider } from "./utils/authContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import ProfileUser from "./page/ProfileUser";
import {WebSocketProvider} from "./utils/WebSocketContext";
import ChatWindow from "./component/ChatDetail";
import PersonalProfile from "./component/personalProfile";
import SettingPage from "./page/settingPage";
import EditProfile from "./page/EditProfile ";
import CreatingPageStories from "./component/creatingPageStories";
import MyStoriesPage from "./component/MyStoriesPage";
import PageStories from "./component/pageStories";


const App = () => {
    return (
        <AuthProvider>
            <WebSocketProvider>
                <Routes>
                    <Route path='/login' element={<Authentication />} />
                    <Route path='/' element={
                        <ProtectedRoute>
                            <Layout />

                        </ProtectedRoute>
                    }>
                        <Route path='/' element={<ChatList />}>
                            <Route path="/chat/:chatId" element={<ChatWindow />} />

                        </Route>
                        <Route path='/my-stories/' element={<MyStoriesPage />} />
                        <Route path='/stories/add' element={<CreatingPageStories />} />
                        <Route path='/stories/:storiesId' element={<PageStories />} />
                        <Route path='/profile/:username' element={<ProfileUser />} />
                        <Route path='/my-profile/:username' element={<PersonalProfile />} />
                        <Route path='/settings/language' element={<p>Language</p>}/>
                        <Route path='/settings/' element={<SettingPage />} />
                        <Route path='/edit-profile/' element={<EditProfile />} />
                    </Route>
                </Routes>
            </WebSocketProvider>
        </AuthProvider>
    )
}

export default App;
