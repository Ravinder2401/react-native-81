export const parseImageAnalysis = (text: string): Array<{ key: string; value: string }> => {
  try {
    const cleanedText = text.replace(/```(?:json)?|```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    const resultArray: Array<{ key: string; value: string }> = [];

    Object.entries(parsedData).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        resultArray.push({ key, value: 'Not available' });
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        const objectString = Object.entries(value)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n');
        resultArray.push({ key, value: objectString });
      } else {
        resultArray.push({ key, value: String(value) });
      }
    });

    return resultArray;
  } catch (e) {
    return [{ key: 'Error', value: 'Failed to parse response.' }];
  }
};
