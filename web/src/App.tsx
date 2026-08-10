<<<<<<< HEAD
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
=======
import { useState, useEffect } from "react";
import {
  getAdminOverview,
  getExpertContent,
  AdminReportData,
  ExpertReportData,
  ApiError,
} from "./api/reportApi";

type Mode = "admin" | "expert";
type Range = "7" | "30" | "90";

export default function App() {
  const [mode, setMode] = useState<Mode>("admin");
  const [range, setRange] = useState<Range>("7");

  const [adminData, setAdminData] = useState<AdminReportData | null>(null);
  const [expertData, setExpertData] = useState<ExpertReportData | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code: string } | null>(
    null,
  );

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - parseInt(range, 10));

      const dateTo = to.toISOString();
      const dateFrom = from.toISOString();

      if (mode === "admin") {
        const data = await getAdminOverview(dateFrom, dateTo);
        setAdminData(data);
      } else {
        const data = await getExpertContent(dateFrom, dateTo);
        setExpertData(data);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: "Đã có lỗi xảy ra", code: "UNKNOWN" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [mode, range]);

  const isAdmin = mode === "admin";

  const renderAdminStats = () => {
    if (!adminData) return null;
    return [
      {
        label: "Doanh thu",
        value: `${(adminData.revenue || 0).toLocaleString("vi-VN")} đ`,
        icon: "💳",
        tone: "green",
      },
      {
        label: "Lượt giao dịch",
        value: adminData.transactionsCount?.toString() || "0",
        icon: "🔄",
        tone: "blue",
      },
      {
        label: "Lượt đăng ký mới",
        value: adminData.subscriptionsCount?.toString() || "0",
        icon: "✨",
        tone: "orange",
      },
      {
        label: "Gói đang kích hoạt",
        value: adminData.subscriptions?.length?.toString() || "0",
        icon: "📦",
        tone: "purple",
      },
    ];
  };

  const renderExpertStats = () => {
    if (!expertData) return null;
    const completionRate =
      expertData.engagementMetrics.views > 0
        ? (expertData.engagementMetrics.completions /
            expertData.engagementMetrics.views) *
          100
        : 0;
    return [
      {
        label: "Bản ghi nội dung",
        value: expertData.contentStats.length.toString(),
        icon: "📝",
        tone: "blue",
      },
      {
        label: "Module nổi bật",
        value: expertData.topModules.length.toString(),
        icon: "🎥",
        tone: "green",
      },
      {
        label: "Lượt xem",
        value: expertData.engagementMetrics.views.toLocaleString("vi-VN"),
        icon: "👁",
        tone: "orange",
      },
      {
        label: "Tỉ lệ hoàn thành",
        value: `${completionRate.toFixed(1)}%`,
        icon: "📈",
        tone: "purple",
      },
    ];
  };

  const currentStats = isAdmin ? renderAdminStats() : renderExpertStats();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">K</span>
          <span>
            Kid<span>Life</span>
          </span>
        </div>
        <div className="workspace-switch">
          <span className="workspace-dot" />
          {isAdmin ? "Admin Dashboard" : "Expert Portal"}
          <span className="chevron">⌄</span>
        </div>
        <nav>
          <NavItem icon="⌂" label="Tổng quan" active />
          <NavItem
            icon="◫"
            label={isAdmin ? "Người dùng" : "Nội dung của tôi"}
          />
          <NavItem
            icon="◈"
            label={isAdmin ? "Kiểm duyệt nội dung" : "Tạo nội dung"}
          />
          <NavItem icon="◷" label="Thống kê" />
          <NavItem icon="⚙" label="Cấu hình" />
        </nav>
        <div className="sidebar-bottom">
          <button
            className="mode-button"
            onClick={() => setMode(isAdmin ? "expert" : "admin")}
          >
            ⇄ Chuyển sang {isAdmin ? "Expert" : "Admin"}
          </button>
          <div className="user-mini">
            <div className="avatar">TB</div>
            <div>
              <strong>{isAdmin ? "Thanh Bình" : "Nguyễn An"}</strong>
              <small>{isAdmin ? "Administrator" : "Education Expert"}</small>
            </div>
            <span>•••</span>
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              {isAdmin ? "ADMIN DASHBOARD" : "EXPERT PORTAL"}
            </p>
            <h1>{isAdmin ? "Tổng quan hệ thống" : "Thống kê nội dung"}</h1>
            <p className="muted">
              Theo dõi những điều đang diễn ra trên KidLife.
            </p>
          </div>
          <div className="top-actions">
            <button className="icon-button">⌕</button>
            <button className="icon-button notification">
              ♢<i />
            </button>
            <button className="primary-button">
              + {isAdmin ? "Thêm nội dung" : "Tạo bài học"}
            </button>
          </div>
        </header>
        <section className="toolbar">
          <div className="tabs">
            <button className="tab active">Tổng quan</button>
            <button className="tab">Báo cáo</button>
            <button className="tab">Hoạt động</button>
          </div>
          <div className="range-select">
            <span>◷</span>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value as Range)}
            >
              <option value="7">7 ngày qua</option>
              <option value="30">30 ngày qua</option>
              <option value="90">90 ngày qua</option>
            </select>
          </div>
        </section>

        {error ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              background: "#fff",
              margin: 30,
              borderRadius: 16,
            }}
          >
            <h3 style={{ color: "red" }}>Lỗi: {error.message}</h3>
            <p className="muted">
              {error.code === "CONFIG_ERROR" || error.code === "NO_TOKEN"
                ? "Vui lòng kiểm tra file .env hoặc đăng nhập."
                : "Có lỗi khi lấy dữ liệu từ server."}
            </p>
            <button
              onClick={fetchReports}
              style={{
                marginTop: 16,
                padding: "8px 16px",
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Thử lại
            </button>
          </div>
        ) : isLoading ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <section className="stats-grid">
              {currentStats?.map((item) => (
                <article className="stat-card" key={item.label}>
                  <div className={`stat-icon ${item.tone}`}>{item.icon}</div>
                  <div className="stat-label">{item.label}</div>
                  <div className="stat-value">{item.value}</div>
                </article>
              ))}
            </section>

            <section className="dashboard-grid">
              {isAdmin ? (
                <article className="panel wide">
                  <div className="panel-header">
                    <div>
                      <h2>Giao dịch gần đây</h2>
                      <p className="muted">
                        Dữ liệu cập nhật theo khoảng thời gian
                      </p>
                    </div>
                    <button className="more">•••</button>
                  </div>
                  <div className="content-list" style={{ marginTop: 16 }}>
                    {adminData?.transactions?.length === 0 && (
                      <p className="muted" style={{ padding: 20 }}>
                        Không có giao dịch nào.
                      </p>
                    )}
                    {adminData?.transactions?.slice(0, 5).map((t) => (
                      <div className="content-row" key={t._id}>
                        <div className="content-icon">💳</div>
                        <div className="content-copy">
                          <strong>
                            {t.amount.toLocaleString()} {t.currency}
                          </strong>
                          <small>
                            {new Date(t.createdAt).toLocaleString()}
                          </small>
                        </div>
                        <span className="views">{t.status}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ) : (
                <article className="panel wide">
                  <div className="panel-header">
                    <div>
                      <h2>Modules được xem nhiều nhất</h2>
                      <p className="muted">Nội dung hiệu quả</p>
                    </div>
                    <button className="more">•••</button>
                  </div>
                  <div className="content-list" style={{ marginTop: 16 }}>
                    {expertData?.topModules?.length === 0 && (
                      <p className="muted" style={{ padding: 20 }}>
                        Không có dữ liệu modules.
                      </p>
                    )}
                    {expertData?.topModules?.map((mod) => (
                      <div className="content-row" key={mod.moduleId}>
                        <div className="content-icon">📚</div>
                        <div className="content-copy">
                          <strong>{mod.name}</strong>
                          <small>Rating: {mod.rating.toFixed(1)} ⭐</small>
                        </div>
                        <span className="views">
                          {mod.views.toLocaleString()} lượt xem
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {isAdmin && (
                <article className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Gói đăng ký mới</h2>
                      <p className="muted">Trong kỳ</p>
                    </div>
                  </div>
                  <div className="content-list" style={{ marginTop: 16 }}>
                    {adminData?.subscriptions?.length === 0 && (
                      <p className="muted" style={{ padding: 20 }}>
                        Chưa có người đăng ký.
                      </p>
                    )}
                    {adminData?.subscriptions?.slice(0, 5).map((sub) => (
                      <div className="content-row" key={sub._id}>
                        <div className="content-icon">✨</div>
                        <div className="content-copy">
                          <strong>Gói {sub.planId}</strong>
                          <small>
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <span className="views">{sub.status}</span>
                      </div>
                    ))}
                  </div>
                </article>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button className={`nav-item ${active ? "active" : ""}`}>
      <span>{icon}</span>
      {label}
    </button>
  );
}
>>>>>>> 9c100f5821007e1b02b22adb6b13a80ea7ea71a3
