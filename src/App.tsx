import React, { useState } from "react";
import "./App.scss";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface FormData {
  revenue: string;
  laborCost: string;
  materialCost: string;
  depreciation: string;
  otherCosts: string;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    revenue: "",
    laborCost: "",
    materialCost: "",
    depreciation: "",
    otherCosts: "",
  });
  const [surplusValue, setSurplusValue] = useState<number | null>(null);
  const [constantCapital, setConstantCapital] = useState<number | null>(null);
  const [variableCapital, setVariableCapital] = useState<number | null>(null);
  const [profitRate, setProfitRate] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateSurplusValue = () => {
    const { revenue, laborCost, materialCost, depreciation, otherCosts } = formData;
    if (!revenue || !laborCost || !materialCost || !depreciation || !otherCosts) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const rev = parseInt(revenue);
    const labor = parseInt(laborCost);
    const material = parseInt(materialCost);
    const dep = parseInt(depreciation);
    const other = parseInt(otherCosts);

    const constantCapitalValue = material + dep + other;
    const variableCapitalValue = labor;
    const surplusValueCalculated = rev - (constantCapitalValue + variableCapitalValue);
    const profitRateCalculated = (surplusValueCalculated / variableCapitalValue) * 100;

    setConstantCapital(constantCapitalValue);
    setVariableCapital(variableCapitalValue);
    setSurplusValue(surplusValueCalculated);
    setProfitRate(profitRateCalculated);
  };

  const chartData = [
    { name: "Tư bản bất biến (C)", value: constantCapital || 0 },
    { name: "Tư bản khả biến (V)", value: variableCapital || 0 },
    { name: "Giá trị thặng dư (M)", value: surplusValue || 0 },
  ];
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Tính Giá Trị Thặng Dư</h1>
        <p>Ứng dụng tính toán và phân tích giá trị thặng dư theo mô hình kinh tế.</p>
      </header>
      <main className="app-main">
        <section className="input-form">
          <h2>Nhập thông tin</h2>
          {Object.keys(formData).map((key) => (
            <div className="input-group" key={key}>
              <label>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</label>
              <input type="text" name={key} value={formData[key as keyof FormData]} onChange={handleChange} placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`} />
            </div>
          ))}
          <div className="button-group">
            <button className="calculate-button" onClick={calculateSurplusValue}>Tính toán</button>
            <button className="explain-button" onClick={() => setIsModalOpen(true)}>Giải thích công thức</button>
          </div>
        </section>

        {surplusValue !== null && (
          <section className="result-section">
            <h2>Kết quả</h2>
            <p>Tư bản bất biến (C): {constantCapital?.toLocaleString("vi-VN")} VNĐ</p>
            <p>Tư bản khả biến (V): {variableCapital?.toLocaleString("vi-VN")} VNĐ</p>
            <p>Giá trị thặng dư (M): {surplusValue?.toLocaleString("vi-VN")} VNĐ</p>
            <p>Tỷ suất giá trị thặng dư (m’): {profitRate?.toFixed(2)}%</p>
            <h2>Biểu đồ phân phối giá trị</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData} dataKey="value" outerRadius={100} label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </section>
        )}
      </main>
      <footer className="app-footer">
        <p>© 2025 - Công cụ tính giá trị thặng dư</p>
      </footer>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Giải thích công thức</h2>
            <p><strong>Tư bản bất biến (C):</strong> Chi phí nguyên vật liệu, khấu hao, chi phí khác.</p>
            <p><strong>Tư bản khả biến (V):</strong> Chi phí tiền lương công nhân.</p>
            <p><strong>Giá trị thặng dư (M):</strong> Phần giá trị còn lại sau khi trừ đi C và V.</p>
            <p><strong>Tỷ suất giá trị thặng dư (m’):</strong> M / V * 100%</p>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;