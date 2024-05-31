import { BiSolidDropletHalf } from "react-icons/bi";
import { FaThermometerEmpty } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

function TempAndDetails({
  weather: {
    description,
    temp,
    icon,
    temp_min,
    temp_max,
    sunrise,
    sunset,
    speed,
    humidity,
    feels_like,
  },
  units,
}) {
  const speedToKm = (speed) => {
    return speed * 3.6;
  };

  const verticalDetails = [
    {
      id: 1,
      Icon: FaThermometerEmpty,
      title: "Sensação Térmica",
      value: `${feels_like.toFixed()}°`,
    },
    {
      id: 2,
      Icon: BiSolidDropletHalf,
      title: "Umidade",
      value: `${humidity.toFixed()}%`,
    },
    {
      id: 3,
      Icon: FiWind,
      title: "Vento",
      value: `${
        units === "metric"
          ? `${speedToKm(speed).toFixed()} km/h`
          : `${speed.toFixed()} mph`
      }`,
    },
  ];

  const horizontalDetails = [
    {
      id: 1,
      Icon: GiSunrise,
      title: "Nascer do Sol",
      value: `${sunrise}`,
    },
    {
      id: 2,
      Icon: GiSunset,
      title: "Por do Sol",
      value: `${sunset}`,
    },
    {
      id: 3,
      Icon: MdKeyboardArrowUp,
      title: "Max",
      value: `${temp_max.toFixed()}°`,
    },
    {
      id: 4,
      Icon: MdKeyboardArrowDown,
      title: "Min",
      value: `${temp_min.toFixed()}°`,
    },
  ];

  return (
    <>
      <div>
        <div className="flex items-center justify-center py-6 text-xl text-cyan-300">
          <p>{description}</p>
        </div>

        <div className="flex flex-row items-center justify-between py-3">
          <img src={icon} alt="weather icon" className="w-20" />
          <p className="text-5xl">{`${temp.toFixed()}°`}</p>

          <div className="flex flex-col space-y-3 items-start">
            {verticalDetails.map(({ id, Icon, title, value }) => (
              <div
                key={id}
                className="flex font-light text-sm items-center justify-center"
              >
                <Icon size={18} className="mr-1" />
                <p>
                  {`${title}: `}
                  <span className="font-medium ml-1">{value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center justify-center space-x-10 text-sm py-3">
          {horizontalDetails.map(({ id, Icon, title, value }) => (
            <div key={id} className="flex flex-row items-center">
              <Icon size={30} />
              <p className="font-light ml-1">
                {`${title}: `}
                <span className="font-medium ml-1">{value}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TempAndDetails;
