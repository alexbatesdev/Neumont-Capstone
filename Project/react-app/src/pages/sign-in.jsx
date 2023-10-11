import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Button, Typography, useTheme } from '@mui/material'
import Link from 'next/link'
import { SignInCard } from '@/components/signInCard'
import { OneComponentTemplate } from '@/components/oneComponentPageTemplate'

export default function SignIn() {
    const theme = useTheme();

    return (
        <OneComponentTemplate title="Sign In">
            <SignInCard />
        </OneComponentTemplate>
    )
}
