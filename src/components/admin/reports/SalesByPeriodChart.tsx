import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SalesByPeriodChartProps {
  salesData: any[];
}

const SalesByPeriodChart = ({ salesData }: SalesByPeriodChartProps) => {
  const chartData = useMemo(() => {
    const salesByMonth = salesData.reduce((acc: any, sale) => {
      const date = new Date(sale.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          period: monthYear,
          ventas: 0,
          ingresos: 0,
          comisiones: 0
        };
      }
      
      acc[monthYear].ventas += 1;
      acc[monthYear].ingresos += sale.sale_amount;
      acc[monthYear].comisiones += sale.commission_amount;
      
      return acc;
    }, {});

    return Object.values(salesByMonth).sort((a: any, b: any) => {
      const [aMonth, aYear] = a.period.split('/').map(Number);
      const [bMonth, bYear] = b.period.split('/').map(Number);
      return aYear === bYear ? aMonth - bMonth : aYear - bYear;
    });
  }, [salesData]);

  const chartConfig = {
    ventas: {
      label: "Ventas",
      color: "hsl(var(--chart-1))",
    },
    ingresos: {
      label: "Ingresos",
      color: "hsl(var(--chart-2))",
    },
    comisiones: {
      label: "Comisiones",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="ventas" fill="var(--color-ventas)" name="Ventas" />
          <Bar dataKey="ingresos" fill="var(--color-ingresos)" name="Ingresos ($)" />
          <Bar dataKey="comisiones" fill="var(--color-comisiones)" name="Comisiones ($)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SalesByPeriodChart;
