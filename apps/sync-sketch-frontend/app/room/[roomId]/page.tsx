import RoomCanvas from "@/components/RoomCanvas"
import { checkRoom } from "@/lib/checkRoom"

export default async function DrawingRoom({params} : {params: Promise<{
    roomId: string
}>}) {
    const roomId = (await params).roomId
    if(await checkRoom(roomId)) {
        return <div>
            <RoomCanvas roomId={roomId}/>
        </div>
    } else {
        return <div>Incorrect room code</div>
    }
}