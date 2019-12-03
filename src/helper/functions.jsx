export const generateHeartSmartRisk = (value) => {
		if(value < 3) { return 'lowRisk' }
		else if(value >=3 && value <=5) { return 'midRisk' }
		else { return 'highRisk' }
}

export const generateHeartSmartScale = (data) => {
  const { bloodPressure, cholesterol, smoking, diabetes, bmi, waistCircumference, physicalActivity } = data;

  // console.log("generate heart smart risk data", data);
  var points = [
    (bloodPressure && bloodPressure >= 190) ? 2 : 0,
    (cholesterol && cholesterol >= 200) ? 2 : 0,
    (smoking == 1 || smoking == "1") ? 2 : 0,
    (bmi && bmi >= 18.5) ? 1 : 0,
    (waistCircumference && waistCircumference >= 36) ? 1 : 0,
    (physicalActivity && physicalActivity >= 60) ? -1 : ((physicalActivity && physicalActivity <= 30) ? 1 : 0),
    (diabetes == 1 || diabetes == "1") ? 1 : 0,
  ];

  //summing up the variables
  var sum = points.reduce((a, b) => a + b);
  return sum;
}

export const average = (mapValuesList) => {
	return mapValuesList.reduce(function (previous,sum)
	{ return previous + sum}, 0) / mapValuesList.length;
}

export const createMapPressure = (currentYearData) => {
	// const {currentYearData} = this.state;
	const labels = currentYearData && Object.keys(currentYearData);
	const values = currentYearData && Object.values(currentYearData);

	const seriesLabels = labels && labels.length > 0 && labels.map((label, index) => {
			return `${label}`;
	});

	const dBloodIdentifier = 'dBloodPressure';
	const sBloodIdentifier = 'sBloodPressure';
	const seriesValues = values && values.length > 0 && values.map((value, index) => {
			return (1/3 * value.average[dBloodIdentifier]) + (1/3 * value.average[sBloodIdentifier]);

	});
	const mapValueSeriesData = {
		labels: labels,
		series: [seriesValues, ] 
	}
	const mapAverage = average(seriesValues).toFixed(2);

	console.log(`Map Pressure Map data === `, seriesValues, mapValueSeriesData, mapAverage);
	return {mapValueSeriesData, seriesValues, mapAverage }
}
