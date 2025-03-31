import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    const card = await prisma.cards.findFirst({
        where:{
            card_id: body.uid,
            password: body.pin,
        }
    })
    if (!card){
        return new Response("Wrong", { status: 403 });       
    }
    const timeString = body.time;

    const today = new Date();

    const [hours, minutes, seconds] = timeString.split(':');
    const dateWithTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds)
    );
    const log = await prisma.scan_logs.create({
        data:{
            card_id: card.id,
            created_at: dateWithTime,
        }
    })
    if (!log){
        return new Response("Not create log", { status: 400 });  
    }
    console.log("🔐 Access Log Received:", body);
    return new Response("Correct", { status: 200 });
}
  