import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Button, Typography, useTheme } from '@mui/material'
import Link from 'next/link'
import { SignUpCard } from '@/components/signUpCard'
import { OneComponentTemplate } from '@/components/oneComponentPageTemplate'

export default function SignUp() {
    const theme = useTheme();

    return (
        <OneComponentTemplate title="Sign Up">
            <SignUpCard />
        </OneComponentTemplate>
    )
}
