import { RoomCanvas } from "@/app/components/RoomCanvas";

export default async function CanvasPage({ params }: {
  params: {
    roomId: string
  }
}) {
  const roomId = (await params).roomId;

  return (
    <div className="w-screen h-screen overflow-hidden">
      <RoomCanvas roomId={roomId} />
    </div>
  )
}
