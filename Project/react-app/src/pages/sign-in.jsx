import React from 'react'
import { useTheme } from '@mui/material'
import { SignInCard } from '@/components/SignInCard'
import { OneComponentTemplate } from '@/components/oneComponentPageTemplate'

//This page is saying it has random errors despite the fact that it doesn't. I don't know why.
//I think it's an IDE issue because the text is being highlighted wrong too

export default function SignIn() {
    const theme = useTheme();

    return (
        <OneComponentTemplate title="Sign In">
            <SignInCard />
        </OneComponentTemplate>
    )
}
