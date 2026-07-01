import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/lib/auth";
import Home from "@/pages/Home";
import PhotoBooth from "@/pages/PhotoBooth";
import Friendbook from "@/pages/Friendbook";
import FriendbookDetail from "@/pages/FriendbookDetail";
import Gallery from "@/pages/Gallery";
import Leaderboards from "@/pages/Leaderboards";
import WallOfFame from "@/pages/WallOfFame";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import TaskDetail from "@/pages/TaskDetail";
import Profile from "@/pages/Profile";
import Funnels from "@/pages/Funnels";
import Admin from "@/pages/Admin";

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photo-booth" element={<PhotoBooth />} />
          <Route path="/friendbook" element={<Friendbook />} />
          <Route path="/friendbook/:id" element={<FriendbookDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/wall-of-fame" element={<WallOfFame />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute>
                <TaskDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/funnels"
            element={
              <ProtectedRoute>
                <Funnels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}
