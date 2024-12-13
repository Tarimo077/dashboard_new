import { ReactElement } from "react"

interface cardProps {
    title: string,
    value: string,
    unit: string,
    icon: ReactElement;
}
const DataCard = ({title, value, unit, icon}: cardProps) => {
  return (
    <div className="bg-base-100 text-white flex-col w-1/2 border-double border-4 border-green-700 rounded-lg shadow-2xl text-center content-center">
        <div className="flex place-content-center p-1">
        <strong className="text-xl text-green-500 mr-1">{icon}</strong>
        <strong className="text-xl text-green-500">{title}</strong><br></br>
        </div>
        <span className="text-lg text-orange-500">{value} {unit}</span><br></br>
    </div>
  )
}

export default DataCard