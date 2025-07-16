import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from './header'

describe('Header', () => {
    it('renders the header with correct text', () => {
        render(<Header />)
        const heading = screen.getByRole('heading', { name: /RiskGPS/i })
        expect(heading).toBeInTheDocument();
    })

    it('applies correct styles to the Box', () => {
        const { container } = render(<Header />)
        const box = container.firstChild as HTMLElement
        expect(box).toHaveStyle({
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            color: '#000000',
        })
    })
})