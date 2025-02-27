import Db_Connection from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {


    const { fullName, phoneNumber, email, password } = await req.json()
    console.log('Received data:', { fullName, phoneNumber, email, password });


    if (!email || !password || !fullName || !phoneNumber) {
        return NextResponse.json({ message: 'Incomplete input data' })
    }

    console.log(fullName, phoneNumber, email, password)

    try {
        await Db_Connection()

        const existingUser = await User.findOne({ email })
        console.log('Existing user:', existingUser)

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        console.log('Hashed Password:', hashedPassword)

        const newUser = new User({
            fullName: fullName,
            phoneNumber: phoneNumber,
            email,
            password: hashedPassword,
            isAdmin: false,
        })

        console.log('New user:', newUser)
        await newUser.save()

        return NextResponse.json({ message: 'User created successfully' }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}