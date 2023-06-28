import moment from "moment";

export const formatTime = (time: string) => {
  const currentTime = moment.utc(time).utcOffset("+05:30"); // Convert to Indian Standard Time

  const duration = moment.duration(moment().diff(currentTime));

  if (duration.asHours() < 1) {
    return moment(currentTime).format("HH:mm");
  } else if (duration.asDays() < 1) {
    return `${Math.floor(duration.asHours())} h ago`;
  } else if (duration.asWeeks() < 1) {
    return `${Math.floor(duration.asDays())} d ago`;
  } else if (duration.asMonths() < 1) {
    return `${Math.floor(duration.asWeeks())} w ago`;
  } else if (duration.asYears() < 1) {
    return `${Math.floor(duration.asMonths())} m ago`;
  } else if (duration.asYears() > 1) {
    return `${Math.floor(duration.asYears())} y ago`;
  }
};
