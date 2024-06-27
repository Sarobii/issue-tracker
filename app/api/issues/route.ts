import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import prisma from "@/prisma/client";
import { createIssueSchema} from '../../ValidationSchemas';

    
export async function POST(request: NextRequest) {
    if (!request) {
        throw new Error('Request is null or undefined');
    }
    try {
        const body = await request.json();
        if (!body) {
            throw new Error('Request body is null or undefined');
        }
        const validation = createIssueSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.format(), { status: 400 });
        }
        const newIssue = await prisma.issue.create({
            data: {title: body.title, description: body.description}
        });
        if (!newIssue) {
            throw new Error('Failed to create new issue');
        }
        return NextResponse.json(newIssue, {status: 201});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
