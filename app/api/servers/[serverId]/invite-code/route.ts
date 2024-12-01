import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    // { params }: { params: { serverId: string } }
    context: { params: { serverId: string } }
){
    try {
        const profile = await currentProfile();

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }

        const { params } = context;
        const { serverId } = await params; // Thêm await ở đây

        if(!serverId){
            return new NextResponse("Sever ID Missing", {status: 404});
        }
        
        const server = await db.server.update({
            where: {
                id:serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            },
        });

        return NextResponse.json(server);

    }catch(error){
        console.error("[SERVER_ID]",error);
        return new NextResponse("Internal Error", {status: 500});
    }
}