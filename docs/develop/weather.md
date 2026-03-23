---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Weather Insight 

The Weather Insight feature provides users with personalized current and forecasted weather conditions. The weather data is based upon the user's postal code and is updated every 24 hours. The feature includes a weather icon, a brief description of the current weather, and a forecast for the next few days.

<img src="/img/develop/weather/weather-insight.png"/>

The weather data is currently sourced from the [OpenWeather API](https://openweathermap.org/api), which provides comprehensive weather information. The API is integrated into the GGC app to fetch and display relevant weather insights to users, helping them make informed decisions about their gardening activities based on current and upcoming weather conditions.

## Setting up the OpenWeather API

To set up the OpenWeather API for the Weather Insight feature, follow these steps:

1. Create a `.env` file in the root directory of your project if it doesn't already exist.
2. Add the following line to your `.env` file, replacing `YOUR_API_KEY` with your actual OpenWeather API key:
    ```
    OpenWeather_API=YOUR_API_KEY
    ```
   Contact Jenna, Philip, or Cam to get the API key if you don't have it.
3. Save the `.env` file and ensure that it is included in your project's environment variables. The `.env` file should be listed in your `.gitignore` file to prevent it from being committed to version control, as it contains sensitive information. The `.env` file is not included in the flutter assets, so it won't be bundled with the app when it's built and deployed. Instead, the API key will be accessed at runtime from the environment variables.
4. Run the `./run_build_runner.sh` script to regenerate the code that accesses the OpenWeather API with the new API key. The key is obscured int the `/lib/env/env.g.dart` file, so you won't see it there, but it will be used in the code that accesses the API. The `env.g.dart` file is also listed in the `.gitignore` file, so it won't be committed to version control either.

## Data model

### WeatherInfo class

We created a `WeatherInfo` class to represent the weather data that we fetch from the OpenWeather API. This class provides two advantages:
1. It abstracts away from the actual weather service being used, so that if we decide to switch to a different weather service in the future, we can simply update the code that fetches the weather data and maps it to the `WeatherInfo` class, without having to change any of the client code that uses the `WeatherInfo` class.
2. The WeatherInfo class can provide methods to perform data transformations. For example, it could present temp data as either Fahrenheit or Celsius depending on the user's country.

```dart
@freezed
abstract class WeatherInfo with _$WeatherInfo {
  const factory WeatherInfo({
    required String country, // Either US or CA for now.
    required DateTime
    date, // The date of the weather information, typically the current date.
    required double minTemp, // Minimum temperature for the day.
    required double maxTemp, // Maximum temperature for the day.
    required double?
    rainInMM, // Rainfall in millimeters for the day, if available.
    required double?
    snowInMM, // Snowfall in millimeters for the day, if available.
    required DateTime sunrise, // Sunrise time for the day.
    required DateTime sunset, // Sunset time for the day.
    required String
    description, // A brief description of the current weather conditions (e.g., "light rain", "clear sky").
    required String
    iconUrl, // URL to an icon representing the current weather conditions.
    required List<WeatherForecastInfo>
    forecast, // A list of forecast information for the upcoming days.
    required List<WeatherAlertInfo>?
    alerts, // A list of weather alerts for the area, if any are present.
  }) = _WeatherInfo;
}
```

The `WeatherInfo` class includes fields for the current weather conditions, as well as a list of `WeatherForecastInfo` objects that provide forecasted weather data for the next few days, and a list of `WeatherAlertInfo` objects that provide information about any weather alerts that may be present for the user's area. This design allows us to encapsulate all relevant weather information in a single class, making it easier for client code to access and use this data.

It has another factory constructor, `WeatherInfo.fromOneCall3`, that takes in the raw data from the OpenWeather API and maps it to the `WeatherInfo` class. This constructor is responsible for extracting the relevant information from the API response and populating the fields of the `WeatherInfo` class accordingly. This design allows us to keep the mapping logic separate from the rest of the code that uses the `WeatherInfo` class, making it easier to maintain and update the code in the future if we decide to switch to a different weather service or if the API response format changes.

The `WeatherInfo` class also includes methods to perform data transformations, for example:
* `String get degreeUnit => country == 'US' ? '°F' : '°C';` to determine the appropriate degree unit based on the user's country.
* `String get minTempWithUnit => '${minTemp.toStringAsFixed(0)} $degreeUnit';` to present the minimum temperature with the appropriate unit.
* `bool get minTempIsFreezing => country == 'US' ? minTemp < 32 : minTemp < 0;` to determine if the minimum temperature is below freezing based on the user's country.
* `double? get precipitationInPreferredUnit` to present the precipitation data in the appropriate unit (inches for US, millimeters for CA).
* `String get precipitationLevel` to provide a qualitative description of the precipitation level (e.g., "light", "moderate", "heavy") based on the amount of precipitation.
* `String get precipitationDescription` to provide a short precipitation description (e.g., "Light Rain (5.00mm) expected") that can be used in the UI.


### WeatherForecastInfo class

We also created a `WeatherForecastInfo` class to represent the forecasted weather data for the next few days. This class is used as a field in the `WeatherInfo` class to provide users with a forecast of upcoming weather conditions.

```dart
@freezed
abstract class WeatherForecastInfo with _$WeatherForecastInfo {
  const factory WeatherForecastInfo({
    required String country, // Either US or CA for now.
    required DateTime date, // The date of the forecast information.
    required double minTemp, // Minimum temperature for the day.
    required double maxTemp, // Maximum temperature for the day.
    required String
    iconUrl, // URL to an icon representing the forecasted weather conditions.
  }) = _WeatherForecastInfo;
}
```
The `WeatherForecastInfo` class has two helper methods:
* `String get degreeUnit => country == 'US' ? '°F' : '°C';` to determine the appropriate degree unit based on the user's country.
* `String get tempRange =>
  '${minTemp.toStringAsFixed(0)} - ${maxTemp.toStringAsFixed(0)} $degreeUnit';` to present the temperature range for the day with the appropriate unit. These methods allow client code to easily access the forecasted weather data in a user-friendly format, without having to perform the necessary calculations and formatting themselves.

### WeatherAlertInfo class

Finally, we created a `WeatherAlertInfo` class to represent any weather alerts that may be present for the user's area. This class is used as a field in the `WeatherInfo` class to provide users with important information about severe weather conditions that may affect their gardening activities.

```dart
@freezed
abstract class WeatherAlertInfo with _$WeatherAlertInfo {
  const factory WeatherAlertInfo({
    required String
    senderName, // The name of the entity that issued the alert (e.g., a weather service or government agency).
    required String
    event, // The type of weather event (e.g., "Flood Warning", "Heat Advisory").
    required DateTime
    start, // The start time of the alert, indicating when the weather event is expected to begin.
    required DateTime
    end, // The end time of the alert, indicating when the weather event is expected to end.
    required String
    description, // A detailed description of the weather alert, providing information about the nature of the event, potential impacts, and any recommended actions for those in the affected area.
    required List<String>
    tags, // A list of tags associated with the alert, which can be used for categorization or filtering (e.g., "flood", "heat", "wind").
  }) = _WeatherAlertInfo;
}
```
