import { useEffect, useState } from 'react';
import { fetchSellerSummary, SellerSummary } from './api';
import { TrendingUp, Building2, Calendar, DollarSign, ShoppingCart } from 'lucide-react';
import styles from './App.module.scss';

function App() {
  const [branch, setBranch] = useState('Branch 1');
  const [data, setData] = useState<SellerSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchSellerSummary(branch);
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      }
      setLoading(false);
    };

    load();
  }, [branch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <div className={styles.iconWrapper}>
              <TrendingUp className={styles.icon} />
            </div>
            <h1 className={styles.title}>
              Top Sellers Dashboard
            </h1>
          </div>
          <p className={styles.subtitle}>
            Track the best performing sellers by month across all branches
          </p>
        </div>

        {/* Branch Selection Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Building2 className={styles.cardIcon} />
              Branch Selection
            </div>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.branchSelector}>
              <label 
                className={styles.label}
                htmlFor="branch-select"
              >
                Select Branch to View Performance Data
              </label>
              <select 
                id="branch-select"
                className={styles.select}
                value={branch} 
                onChange={e => setBranch(e.target.value)}
              >
                <option value="Branch 1">Branch 1</option>
                <option value="Branch 2">Branch 2</option>
                <option value="Branch 3">Branch 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`${styles.card} ${styles.loadingCard}`}>
            <div className={styles.loadingContent}>
              <div className={styles.spinner}></div>
              <span className={styles.loadingText}>Loading performance data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`${styles.card} ${styles.errorCard}`}>
            <div className={styles.errorContent}>
              <div className={styles.errorWrapper}>
                <div className={styles.errorIconWrapper}>
                  <TrendingUp className={styles.errorIcon} />
                </div>
                <div className={styles.errorTextWrapper}>
                  <h3 className={styles.errorTitle}>Error Loading Data</h3>
                  <p className={styles.errorMessage}>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && data.length > 0 && (
          <div className={`${styles.card} ${styles.dataTable}`}>
            <div className={styles.cardHeader}>
              <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>
                  <Calendar className={styles.tableIcon} />
                  Top Performers by Month - {branch}
                </div>
                <p className={styles.tableSubtitle}>
                  Best performing seller for each month based on total sales value
                </p>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th className={styles.tableHeadCell}>
                        <div className={styles.headCellContent}>
                          <Calendar className={styles.headIcon} />
                          Month
                        </div>
                      </th>
                      <th className={styles.tableHeadCell}>
                        <div className={styles.headCellContent}>
                          <TrendingUp className={styles.headIcon} />
                          Seller Name
                        </div>
                      </th>
                      <th className={`${styles.tableHeadCell} ${styles.textRight}`}>
                        <div className={`${styles.headCellContent} ${styles.justifyEnd}`}>
                          <ShoppingCart className={styles.headIcon} />
                          Order Count
                        </div>
                      </th>
                      <th className={`${styles.tableHeadCell} ${styles.textRight}`}>
                        <div className={`${styles.headCellContent} ${styles.justifyEnd}`}>
                          <DollarSign className={styles.headIcon} />
                          Total Price
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
  {[...data]
    .sort((a, b) => {
      const MONTH_ORDER = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month);
    })
    .map((row, idx) => (

                      <tr key={idx} className={styles.tableRow}>
                        <td className={`${styles.tableCell} ${styles.fontMedium}`}>
                          {row.month}
                        </td>
                        <td className={`${styles.tableCell} ${styles.fontMedium}`}>
                          {row.seller}
                        </td>
                        <td className={`${styles.tableCell} ${styles.textRight}`}>
                          <div className={styles.cellContent}>
                            {row.orderCount.toLocaleString()}
                          </div>
                        </td>
                        <td className={`${styles.tableCell} ${styles.textRight} ${styles.fontSemibold}`}>
                          {formatCurrency(row.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && data.length === 0 && (
          <div className={styles.card}>
            <div className={styles.emptyContent}>
              <div className={styles.emptyIconWrapper}>
                <TrendingUp className={styles.emptyIcon} />
              </div>
              <h3 className={styles.emptyTitle}>No Data Available</h3>
              <p className={styles.emptyMessage}>No seller performance data found for {branch}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
