import React from "react"
import { Dimensions } from "react-native"
// import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { View, Text } from "react-native"

const { width, height } = Dimensions.get("screen")
const PostsSkeleton = () => (
	<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
		<Text>Loading...</Text>
	</View>
	// <SkeletonPlaceholder>
	//     <SkeletonPlaceholder.Item width={width} height={height / 3}/>
	//     <SkeletonPlaceholder.Item flexDirection="row">
	//     <SkeletonPlaceholder.Item width={width / 3} marginHorizontal={10} height={width / 3} borderRadius={20} marginVertical={-90}/>
	//     <SkeletonPlaceholder.Item width={width / 3} marginHorizontal={10} height={width / 3} borderRadius={20} marginVertical={-90}/>
	//     <SkeletonPlaceholder.Item width={width / 3} marginHorizontal={10} height={width / 3} borderRadius={20} marginVertical={-90}/>
	//     </SkeletonPlaceholder.Item>
	//     <SkeletonPlaceholder.Item marginTop={60} flexDirection="row">
	//         <SkeletonPlaceholder.Item width={width / 4.5} marginHorizontal={5} height={40} />
	//         <SkeletonPlaceholder.Item width={width / 4.5} marginHorizontal={5} height={40} />
	//         <SkeletonPlaceholder.Item width={width / 4.5} marginHorizontal={5} height={40} />
	//         <SkeletonPlaceholder.Item width={width / 4.5} marginHorizontal={5} height={40} />
	//     </SkeletonPlaceholder.Item>
	//     <SkeletonPlaceholder.Item>
	//         <SkeletonPlaceholder.Item flexDirection="row" width={width / 1.2} alignSelf="center" marginTop={30} justifyContent="space-between">
	//             <SkeletonPlaceholder.Item flexDirection="row">
	//             <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
	//             <SkeletonPlaceholder.Item marginLeft={15} marginTop={10}>
	//                 <SkeletonPlaceholder.Item width={80} height={10} marginVertical={3} />
	//                 <SkeletonPlaceholder.Item width={50} height={10} marginVertical={3} />
	//             </SkeletonPlaceholder.Item>
	//                 </SkeletonPlaceholder.Item>

	//             <SkeletonPlaceholder.Item width={50} height={20} marginTop={20}   />
	//         </SkeletonPlaceholder.Item>
	//         <SkeletonPlaceholder.Item width={width / 1.2} height={200} alignSelf='center' marginTop={10} />
	//     </SkeletonPlaceholder.Item>
	//     <SkeletonPlaceholder.Item>
	//         <SkeletonPlaceholder.Item flexDirection="row" width={width / 1.2} alignSelf="center" marginTop={30} justifyContent="space-between">
	//             <SkeletonPlaceholder.Item flexDirection="row">
	//             <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
	//             <SkeletonPlaceholder.Item marginLeft={15} marginTop={10}>
	//                 <SkeletonPlaceholder.Item width={80} height={10} marginVertical={3} />
	//                 <SkeletonPlaceholder.Item width={50} height={10} marginVertical={3} />
	//             </SkeletonPlaceholder.Item>
	//                 </SkeletonPlaceholder.Item>

	//             <SkeletonPlaceholder.Item width={50} height={20} marginTop={20}   />
	//         </SkeletonPlaceholder.Item>
	//         <SkeletonPlaceholder.Item width={width / 1.2} height={200} alignSelf='center' marginTop={10} />
	//     </SkeletonPlaceholder.Item>
	// </SkeletonPlaceholder>
)

export default PostsSkeleton
