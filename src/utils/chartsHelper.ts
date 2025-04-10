import Chart from 'chart.js/auto'

/**
 * Creates a doughnut chart for win/loss visualization
 * @param canvas HTML Canvas element reference
 * @param wins Number of wins
 * @param losses Number of losses
 * @returns Chart instance
 */
export function createWinLossChart(canvas: HTMLCanvasElement, wins: number, losses: number): Chart | null {
    try {
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            console.error('Failed to get canvas context')
            return null
        }

        // Destroy any existing chart on the canvas
        const existingChart = Chart.getChart(canvas)
        if (existingChart) {
            existingChart.destroy()
        }

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Перемоги', 'Поразки'],
                datasets: [
                    {
                        data: [wins, losses],
                        backgroundColor: ['#2563EB', '#E5E7EB'],
                        borderWidth: 0,
                        hoverOffset: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const value = context.raw as number
                                const total = wins + losses
                                const percentage = Math.round((value / total) * 100)
                                return `${context.label}: ${value} (${percentage}%)`
                            },
                        },
                    },
                },
            },
        })
    } catch (error) {
        console.error('Error creating win/loss chart:', error)
        return null
    }
}

/**
 * Creates a performance line chart
 * @param canvas HTML Canvas element reference
 * @param labels Date labels for x-axis
 * @param data Performance data (1 for win, 0 for loss)
 * @returns Chart instance
 */
export function createPerformanceChart(canvas: HTMLCanvasElement, labels: string[], data: number[]): Chart | null {
    try {
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            console.error('Failed to get canvas context')
            return null
        }

        // Destroy any existing chart on the canvas
        const existingChart = Chart.getChart(canvas)
        if (existingChart) {
            existingChart.destroy()
        }

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Результат',
                        data,
                        backgroundColor: 'rgba(37, 99, 235, 0.2)',
                        borderColor: '#2563EB',
                        borderWidth: 2,
                        pointBackgroundColor: '#2563EB',
                        fill: true,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: 0,
                        max: 1,
                        ticks: {
                            stepSize: 1,
                            callback: function (value) {
                                return value === 1 ? 'Перемога' : 'Поразка'
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        })
    } catch (error) {
        console.error('Error creating performance chart:', error)
        return null
    }
}
