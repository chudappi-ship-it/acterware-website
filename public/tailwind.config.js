tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Noto Sans JP"', 'Inter', 'sans-serif'],
            },
            colors: {
                'acter-navy': '#1A3668',
                'acter-blue': '#1673A5',
                'acter-green': '#72C44B',
                'acter-light': '#F4F7F6',
                'acter-dark': '#111827',
            },
            backgroundImage: {
                'gradient-brand': 'linear-gradient(to right, #1A3668, #1673A5, #72C44B)',
                'gradient-brand-hover': 'linear-gradient(to right, #13284f, #125c84, #5a9c3c)',
            }
        }
    }
}
