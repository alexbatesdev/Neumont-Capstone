import React from 'react'
import { useTheme } from '@mui/material'
import { SignUpCard } from '@/components/SignUpCard'
import { OneComponentTemplate } from '@/components/OneComponentPageTemplate'

export default function SignUp() {
    const theme = useTheme();

    return (
        <OneComponentTemplate title="Sign Up">
            <SignUpCard />
        </OneComponentTemplate>
    )
}
