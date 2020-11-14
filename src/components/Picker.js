import React, { Component } from "react";
import { Platform, View, Picker } from "react-native";

class Picker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        {Platform.OS === "ios" ? (
          <Picker
            selectedValue={this.state.size}
            style={{ flex: 1, width: "100%", height: "35%" }}
            itemStyle={{ height: 100 }}
            onValueChange={itemValue => this.setState({ size: itemValue })}
          >
            {this.state.options.map((item, index) => {
              return <Picker.Item label={item} value={item} key={index} />;
            })}
          </Picker>
        ) : (
          <Picker
            selectedValue={this.state.size}
            style={{ height: 50, width: "100%" }}
            mode={"dropdown"}
            onValueChange={itemValue => this.setState({ size: itemValue })}
          >
            {this.state.options.map((item, index) => {
              return <Picker.Item label={item} value={item} key={index} />;
            })}
          </Picker>
        )}
      </View>
    );
  }
}

export default Picker;
