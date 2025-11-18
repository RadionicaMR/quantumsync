import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface TopAffiliatesChartProps {
  affiliatesData: any[];
}

const TopAffiliatesChart = ({ affiliatesData }: TopAffiliatesChartProps) => {
  const chartData = useMemo(() => {
    return affiliatesData
      .slice(0, 10)
      .map(aff => ({
        nombre: aff.name,
        ventas: aff.total_sales,
        comisiones: aff.total_commissions,
        clicks: aff.total_clicks
      }));
  }, [affiliatesData]);

  const chartConfig = {
    ventas: {
      label: "Ventas",
      color: "hsl(var(--chart-1))",
    },
    comisiones: {
      label: "Comisiones",
      color: "hsl(var(--chart-2))",
    },
    clicks: {
      label: "Clicks",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="nombre" type="category" width={150} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="ventas" fill="var(--color-ventas)" name="Ventas" />
          <Bar dataKey="comisiones" fill="var(--color-comisiones)" name="Comisiones ($)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TopAffiliatesChart;
