import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Printer, Filter, PieChart as PieChartIcon, Activity, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CategoryDonutChart } from '../components/analytics/CategoryDonutChart';
import { IncomeExpenseBarChart } from '../components/analytics/IncomeExpenseBarChart';
import { useAuthStore } from '../store/useAuthStore';
import type { ReportData } from '../types/report';
import api from '../services/api';

const Reports = () => {
  const { user } = useAuthStore();
  const today = new Date();
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  });

  const { data: report, isLoading } = useQuery<ReportData>({
    queryKey: ['reports', dateRange.startDate, dateRange.endDate],
    queryFn: async () => {
      const res = await api.get('/reports', {
        params: dateRange
      });
      return res.data;
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.currency || 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleExportCSV = () => {
    if (!report?.transactions.length) return;
    
    // CSV Headers
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Type', 'Status', 'Notes'];
    
    // CSV Rows
    const rows = report.transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.amount.toString(),
      t.type,
      t.status,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Create Blob with UTF-8 BOM for proper Excel encoding
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ExpenseFlow_Report_${dateRange.startDate}_to_${dateRange.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 print:bg-white print:text-black print:p-0 print:space-y-4">
      {/* Header - Hidden on Print, replaced by print header */}
      <div className="sm:flex sm:items-center sm:justify-between print:hidden">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Reports & Export
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate downloadable financial summaries.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0 flex space-x-3">
          <Button onClick={handleExportCSV} variant="outline" className="flex items-center">
            <Download className="-ml-1 mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handlePrintPDF} className="flex items-center">
            <Printer className="-ml-1 mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block border-b-2 border-gray-200 pb-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Financial Report</h1>
        <p className="text-gray-500 mt-2">
          Period: {format(new Date(dateRange.startDate), 'MMM d, yyyy')} - {format(new Date(dateRange.endDate), 'MMM d, yyyy')}
        </p>
        <p className="text-gray-400 text-sm">
          Generated on {format(new Date(), 'MMM d, yyyy h:mm a')}
        </p>
      </div>

      {/* Filters - Hidden on Print */}
      <Card glass className="p-6 print:hidden">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Report Filters</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
          />
          <Input
            label="End Date"
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
            <Card key={i} glass className="p-6 h-32 animate-pulse"></Card>
          ))}
        </div>
      ) : report ? (
        <>
          {/* Metrics Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4 print:page-break-inside-avoid">
            <Card glass className="p-6 print:border print:shadow-none">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 print:bg-transparent">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400 print:text-black" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 print:text-gray-600">Total Income</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white print:text-black">
                    {formatCurrency(report.summary.totalIncome)}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card glass className="p-6 print:border print:shadow-none">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 print:bg-transparent">
                  <TrendingDown className="h-6 w-6 text-rose-600 dark:text-rose-400 print:text-black" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 print:text-gray-600">Total Expense</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white print:text-black">
                    {formatCurrency(report.summary.totalExpense)}
                  </p>
                </div>
              </div>
            </Card>

            <Card glass className="p-6 print:border print:shadow-none">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 print:bg-transparent">
                  <Activity className="h-6 w-6 text-indigo-600 dark:text-indigo-400 print:text-black" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 print:text-gray-600">Savings</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white print:text-black">
                    {formatCurrency(report.summary.savings)}
                  </p>
                </div>
              </div>
            </Card>

            <Card glass className="p-6 print:border print:shadow-none">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 print:bg-transparent">
                  <Target className="h-6 w-6 text-amber-600 dark:text-amber-400 print:text-black" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 print:text-gray-600">Budget Health</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white print:text-black">
                    {report.budgetSummary.budgetHealth.toFixed(1)}% Used
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4 print:mt-8">
             <div className="print:page-break-inside-avoid">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 print:text-black">
                 Expense by Category
               </h3>
               {report.categoryBreakdown.length > 0 ? (
                 <CategoryDonutChart data={report.categoryBreakdown} />
               ) : (
                 <Card glass className="p-6 h-[350px] flex items-center justify-center print:border print:shadow-none">
                   <p className="text-gray-500 dark:text-gray-400">No expenses in this period.</p>
                 </Card>
               )}
             </div>
             
             <div className="print:page-break-inside-avoid">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 print:text-black">
                 Income vs Expense Trend
               </h3>
               {report.monthlyTrend.length > 0 ? (
                 <IncomeExpenseBarChart data={report.monthlyTrend} />
               ) : (
                 <Card glass className="p-6 h-[350px] flex items-center justify-center print:border print:shadow-none">
                   <p className="text-gray-500 dark:text-gray-400">No transactions in this period.</p>
                 </Card>
               )}
             </div>
          </div>

          {/* Print only detailed summary table */}
          <div className="hidden print:block mt-8 print:page-break-before-always">
             <h3 className="text-xl font-bold text-gray-900 mb-4">
                 Transaction Summary by Category
             </h3>
             <table className="min-w-full divide-y divide-gray-200">
               <thead>
                 <tr>
                   <th className="py-2 text-left text-sm font-semibold text-gray-900">Category</th>
                   <th className="py-2 text-right text-sm font-semibold text-gray-900">Amount</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                 {report.categoryBreakdown.map((cat) => (
                   <tr key={cat.category}>
                     <td className="py-2 text-sm text-gray-700">{cat.category}</td>
                     <td className="py-2 text-sm text-gray-700 text-right">{formatCurrency(cat.amount)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </>
      ) : (
        <Card glass className="p-12 text-center print:hidden">
           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
             <PieChartIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
           </div>
           <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No Report Data</h3>
           <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
             Try adjusting your date filters to see transaction summaries.
           </p>
        </Card>
      )}
    </div>
  );
};

export default Reports;
