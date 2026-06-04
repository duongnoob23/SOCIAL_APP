import React from "react";
import { Button, Text, TextInput, View } from "react-native";
const CustomBottomSheetModal = () => {
  const inputRef = React.useRef<TextInput>(null);
  const [count, setCount] = React.useState(0);
  const countRef = React.useRef(count);
  const [inputValue, setInputValue] = React.useState("");

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  console.log("count", count);
  const handleOnChangeText = (text: string) => {
    setInputValue(text);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      console.log("CALL API");
    }, 500);
  };

  /*
    NOTE(*)

    Một ứng dụng quan trọng của useRef là tối ưu hiệu năng trong các bài toán liên quan đến timer (setInterval, setTimeout) và state thay đổi liên tục.
    Bài toán đặt ra:
    Cần log ra giá trị count liên tục theo thời gian, và mỗi khi count thay đổi thì giá trị được log ra phải là giá trị mới nhất.
    Nếu làm theo cách ngây thơ:
    
    useEffect(() => {
        const timer = setInterval(() => {
            console.log();
        }, 1000);

        return () => clearInterval(timer);
    }, [count]);

    Thì mỗi lần count thay đổi sẽ dẫn tới:
    useEffect chạy lại
    clearInterval cũ
    tạo setInterval mới
    lặp lại liên tục
    Điều này gây tốn hiệu năng vì:
    Interval bị khởi tạo lại vô số lần
    Effect liên tục mount / unmount
    Không cần thiết vì logic interval thực chất không đổi
    Cách cải thiện là:
    useEffect chỉ chạy một lần duy nhất với dependency []
    setInterval chỉ được tạo một lần duy nhất
    Nhưng vẫn luôn log được giá trị count mới nhất
    Muốn làm được điều đó thì cần useRef.
    Khi khởi tạo ref: 
    
    const inputRef = useRef(null);
    Có thể hiểu đơn giản là tạo ra một “cái hộp”:
    inputRef = {
        current: null
    };
    Cái hộp này:
    tồn tại xuyên suốt vòng đời component
    không bị reset khi re-render
    thay đổi current không gây re-render

    Nếu khởi tạo ref bằng một hàm:

    const callbackRef = useRef<(v: number) => void>(() => {});
    callbackRef = {
        current: function () {}
    };
    Trong bài toán này, current không phải là dữ liệu, mà là logic xử lý dữ liệu (hàm log).
    Mỗi khi count thay đổi, ta chỉ cập nhật lại nội dung trong hộp:

    useEffect(() => {
        callbackRef.current = () => {
            console.log(count);
        };
    }, [count]);
*/
  const callbackRef = React.useRef<() => void>(() => {});

  React.useEffect(() => {
    callbackRef.current = () => {
      console.log(count);
    };
  }, [count]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      callbackRef.current();
    }, 1000);
    console.log("run");
    return () => clearInterval(timer);
  }, []);
  return (
    <View>
      <Text>test input</Text>
      <TextInput
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          handleOnChangeText(e.nativeEvent.text);
        }}
        placeholder="Focus input"
        style={{
          padding: 12,
          borderColor: "black",
          borderWidth: 1,
          borderRadius: 8,
        }}
      ></TextInput>
      <Button
        title="Click to Focus Input"
        onPress={() => inputRef.current?.focus()}
      ></Button>
      <Text>Count rerender: {count}</Text>
      <Text>Count ref: {countRef.current}</Text>
      <Button
        title="Increase Count"
        onPress={() => setCount(count + 1)}
      ></Button>
    </View>
  );
};

export default CustomBottomSheetModal;
