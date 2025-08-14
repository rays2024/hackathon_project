import { useState } from 'react'
import './App.css'

function App() {
    const [investmentAmount, setInvestmentAmount] = useState('')
    const [isConnected, setIsConnected] = useState(false)

    const handleConnectWallet = () => {
        setIsConnected(!isConnected)
    }

    const handleStartMining = () => {
        if (!investmentAmount) {
            alert('请输入投资金额')
            return
        }
        alert(`开始挖矿，投资金额: ${investmentAmount} SOL`)
    }

    const handleViewDetails = () => {
        alert('查看详细数据')
    }

    return (
        <div className="app">
            <div className="header">
                <div className="logo">Token Pool</div>
                <button
                    className={`user-menu ${isConnected ? 'connected' : ''}`}
                    onClick={handleConnectWallet}
                >
                    <span>{isConnected ? '已连接' : '连接钱包'}</span>
                    <span>{isConnected ? '✅' : '🔗'}</span>
                </button>
            </div>

            <div className="main-content">
                <div className="card">
                    <div className="card-header">
                        <div className="card-icon">🔥</div>
                        <h2 className="card-title">自动挖矿</h2>
                    </div>

                    <div className="input-group">
                        <label className="input-label">每笔交易费用</label>
                        <div className="fee-display">
                            <span>0.001 SOL</span>
                            <span className="fire-icon">🔥</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">投资金额</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="输入 SOL 数量"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                        />
                    </div>

                    <button
                        className="action-button primary-button"
                        onClick={handleStartMining}
                        disabled={!isConnected}
                    >
                        <span>开始挖矿</span>
                        <span>🚀</span>
                    </button>

                    <div className="info-text">适合长期投资者</div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">数据面板</h2>
                    </div>

                    <ul className="stats-list">
                        <li className="stats-item">
                            <span className="stats-label">待处理</span>
                            <span className="stats-value">30 笔交易</span>
                        </li>
                        <li className="stats-item">
                            <span className="stats-label">总收益</span>
                            <span className="stats-value">90 SOL</span>
                        </li>
                        <li className="stats-item">
                            <span className="stats-label">年化收益率</span>
                            <span className="stats-value">15.6%</span>
                        </li>
                    </ul>

                    <button
                        className="action-button secondary-button"
                        onClick={handleViewDetails}
                    >
                        <span>查看详情</span>
                    </button>
                </div>
            </div>

            <div className="footer">
                <span>流动性池</span>
                <div className="footer-icon">📁</div>
            </div>
        </div>
    )
}

export default App 