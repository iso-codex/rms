import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import CaseworkerLayout from './layouts/CaseworkerLayout';
import RefugeeLayout from './layouts/RefugeeLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Services from './pages/Services';
import Donate from './pages/Donate';
import RefugeeApply from './pages/RefugeeApply';
import Dashboard from './pages/Dashboard';

// Admin
import AdminDashboard from './components/AdminDashboard';

// Caseworker Pages
import CaseworkerDashboard from './pages/caseworker/CaseworkerDashboard';
import CaseList from './pages/caseworker/CaseList';
import CaseDetail from './pages/caseworker/CaseDetail';
import Assessments from './pages/caseworker/Assessments';
import AssessmentForm from './pages/caseworker/AssessmentForm';

import Referrals from './pages/caseworker/Referrals';
import ReferralForm from './pages/caseworker/ReferralForm';

import IIPList from './pages/caseworker/IIPList';
import IIPForm from './pages/caseworker/IIPForm';
import IIPDetail from './pages/caseworker/IIPDetail';

import Events from './pages/caseworker/Events';
import EventForm from './pages/caseworker/EventForm';

// Refugee Pages
import RefugeeHome from './pages/refugee/RefugeeHome';
import MyPlan from './pages/refugee/MyPlan';
import MyRequests from './pages/refugee/MyRequests';

// NGO Pages
import NGODashboard from './components/NGODashboard';
import NGOLayout from './layouts/NGOLayout';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/apply-refugee" element={<RefugeeApply />} />
            </Route>

            {/* Legacy Dashboard */}
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Caseworker Routes */}
            <Route element={<CaseworkerLayout />}>
                <Route path="/caseworker" element={<CaseworkerDashboard />} />
                <Route path="/caseworker/cases" element={<CaseList />} />
                <Route path="/caseworker/cases/:id" element={<CaseDetail />} />
                <Route path="/caseworker/assessments" element={<Assessments />} />
                <Route path="/caseworker/assessments/new" element={<AssessmentForm />} />
                <Route path="/caseworker/assessments/:id" element={<AssessmentForm />} />
                <Route path="/caseworker/referrals" element={<Referrals />} />
                <Route path="/caseworker/referrals/new" element={<ReferralForm />} />
                <Route path="/caseworker/referrals/:id" element={<ReferralForm />} />
                <Route path="/caseworker/iip" element={<IIPList />} />
                <Route path="/caseworker/iip/new" element={<IIPForm />} />
                <Route path="/caseworker/iip/:id" element={<IIPDetail />} />
                <Route path="/caseworker/iip/:id/edit" element={<IIPForm />} />
                <Route path="/caseworker/events" element={<Events />} />
                <Route path="/caseworker/events/new" element={<EventForm />} />
                <Route path="/caseworker/events/:id" element={<EventForm />} />
            </Route>

            {/* Refugee Routes */}
            <Route element={<RefugeeLayout />}>
                <Route path="/refugee" element={<RefugeeHome />} />
                <Route path="/refugee/plan" element={<MyPlan />} />
                <Route path="/refugee/requests" element={<MyRequests />} />
            </Route>

            {/* NGO Routes */}
            <Route element={<NGOLayout />}>
                <Route path="/ngo" element={<NGODashboard />} />
            </Route>
        </Routes>
    );
}

export default App;
