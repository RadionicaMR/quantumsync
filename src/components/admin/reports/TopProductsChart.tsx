import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface TopProductsChartProps {
  salesData: any[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const TopProductsChart = ({ salesData }: TopProductsChartProps) => {
  const chartData = useMemo(() => {
    const productSales = salesData.reduce((acc: any, sale) => {
      const productKey = sale.product_id || 'Producto General';
      
      if (!acc[productKey]) {
        acc[productKey] = {
          name: productKey,
          value: 0,
          ventas: 0
        };
      }
      
      acc[productKey].value += sale.sale_amount;
      acc[productKey].ventas += 1;
      
      return acc;
    }, {});

    return Object.values(productSales)
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 5);
  }, [salesData]);

  const chartConfig = {
    value: {
      label: "Ingresos",
    },
  };

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chartData.map((product: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <h4 className="font-semibold">{product.name}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Ventas: {product.ventas} | Ingresos: ${product.value.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsChart;
