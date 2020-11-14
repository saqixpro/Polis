import React from "react"
import { Dimensions, View, Text } from "react-native"
// import SkeletonPlaceholder from "react-native-skeleton-placeholder"

const { width, height } = Dimensions.get("screen")

const App = () => (
	<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
		<Text>Loading...</Text>
	</View>
	//     <SkeletonPlaceholder>
	//      <SkeletonPlaceholder.Item flexDirection="row" width="100%" justifyContent="center" alignItems="center">
	//      <SkeletonPlaceholder.Item width={80} marginTop={50} height={80} borderRadius={30} />
	//   </SkeletonPlaceholder.Item>
	//   <SkeletonPlaceholder.Item width={100} height={20} borderRadius={10} alignSelf="center" marginTop={20} />
	//   <SkeletonPlaceholder.Item width={100} height={15} borderRadius={10} alignSelf="center" marginTop={10} />
	//   <SkeletonPlaceholder.Item flexDirection="row" paddingHorizontal={10} justifyContent="space-between" marginTop={15}>
	//       <SkeletonPlaceholder.Item width={100} height={20} />
	//       <SkeletonPlaceholder.Item  width={100} height={20} />
	//   </SkeletonPlaceholder.Item>
	//   <SkeletonPlaceholder.Item alignSelf="center" width={100} height={20} marginTop={10} />
	//   <SkeletonPlaceholder.Item alignSelf="center" width={width / 1.05} height={20} marginTop={10} />
	//   <SkeletonPlaceholder.Item flexDirection="row" paddingHorizontal={10} justifyContent="space-between" marginTop={10}>
	//       <SkeletonPlaceholder.Item width={100} height={20} />
	//       <SkeletonPlaceholder.Item  width={100} height={20} />
	//       <SkeletonPlaceholder.Item  width={100} height={20} />
	//   </SkeletonPlaceholder.Item>
	//   <SkeletonPlaceholder.Item flexDirection="row" paddingHorizontal={10} justifyContent="space-between" marginTop={25}>
	//       <SkeletonPlaceholder.Item width={110} height={20} />
	//       <SkeletonPlaceholder.Item  width={110} height={20} />
	//   </SkeletonPlaceholder.Item>
	//   <SkeletonPlaceholder.Item width={width / 1.1} alignSelf="center" borderRadius={10} height={height / 5} marginTop={20} />
	//   <SkeletonPlaceholder.Item width={width / 1.1} alignSelf="center" borderRadius={10} height={height / 5} marginTop={20} />
	//   <SkeletonPlaceholder.Item width={width / 1.1} alignSelf="center" borderRadius={10} height={height / 5} marginTop={20} />
	// </SkeletonPlaceholder>
)

export default App
