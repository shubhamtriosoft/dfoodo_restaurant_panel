import { fabric } from "fabric";

import pillarIcon from "../assets/pillar.svg";
import decorativeicon from "../assets/decorative.svg";
const backgroundColor_main = "#FFF8F2";
const tableFill_main = "#A098AE";
const tableFill_main_dark = "#8fce00";
const barFill_main = "#f58634";
const blocked_main = "#212121";
const white_main = "#FFFFFF";
const runining_table = "#509d30";
const running_table = "#509d30";
const walking_table = "#99E699";
const ready_for_allot = "#ff0000";
const selected_table = "#f58634";
const offline_table = "#0688FF";
const borderColor = "#f58634";
const cornerColor = "#f58634";
const scrollLimitCanvas = 200;
const initialViewportTransform = [1, 0, 0, 1, 0, 0]; // [scaleX, skewX, skewY, scaleY, translateX, translateY]
var deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F00336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var cloneIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 55.699 55.699' width='100px' height='100px' xml:space='preserve'%3E%3Cpath style='fill:%23010002;' d='M51.51,18.001c-0.006-0.085-0.022-0.167-0.05-0.248c-0.012-0.034-0.02-0.067-0.035-0.1 c-0.049-0.106-0.109-0.206-0.194-0.291v-0.001l0,0c0,0-0.001-0.001-0.001-0.002L34.161,0.293c-0.086-0.087-0.188-0.148-0.295-0.197 c-0.027-0.013-0.057-0.02-0.086-0.03c-0.086-0.029-0.174-0.048-0.265-0.053C33.494,0.011,33.475,0,33.453,0H22.177 c-3.678,0-6.669,2.992-6.669,6.67v1.674h-4.663c-3.678,0-6.67,2.992-6.67,6.67V49.03c0,3.678,2.992,6.669,6.67,6.669h22.677 c3.677,0,6.669-2.991,6.669-6.669v-1.675h4.664c3.678,0,6.669-2.991,6.669-6.669V18.069C51.524,18.045,51.512,18.025,51.51,18.001z M34.454,3.414l13.655,13.655h-8.985c-2.575,0-4.67-2.095-4.67-4.67V3.414z M38.191,49.029c0,2.574-2.095,4.669-4.669,4.669H10.845 c-2.575,0-4.67-2.095-4.67-4.669V15.014c0-2.575,2.095-4.67,4.67-4.67h5.663h4.614v10.399c0,3.678,2.991,6.669,6.668,6.669h10.4 v18.942L38.191,49.029L38.191,49.029z M36.777,25.412h-8.986c-2.574,0-4.668-2.094-4.668-4.669v-8.985L36.777,25.412z M44.855,45.355h-4.664V26.412c0-0.023-0.012-0.044-0.014-0.067c-0.006-0.085-0.021-0.167-0.049-0.249 c-0.012-0.033-0.021-0.066-0.036-0.1c-0.048-0.105-0.109-0.205-0.194-0.29l0,0l0,0c0-0.001-0.001-0.002-0.001-0.002L22.829,8.637 c-0.087-0.086-0.188-0.147-0.295-0.196c-0.029-0.013-0.058-0.021-0.088-0.031c-0.086-0.03-0.172-0.048-0.263-0.053 c-0.021-0.002-0.04-0.013-0.062-0.013h-4.614V6.67c0-2.575,2.095-4.67,4.669-4.67h10.277v10.4c0,3.678,2.992,6.67,6.67,6.67h10.399 v21.616C49.524,43.26,47.429,45.355,44.855,45.355z'/%3E%3C/svg%3E%0A";

const svgRotateIcon = encodeURIComponent(`
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d)">
      <circle cx="9" cy="9" r="5" fill="white"/>
      <circle cx="9" cy="9" r="4.75" stroke="black" stroke-opacity="0.3" stroke-width="0.5"/>
    </g>
      <path d="M10.8047 11.1242L9.49934 11.1242L9.49934 9.81885" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.94856 6.72607L8.25391 6.72607L8.25391 8.03142" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9.69517 6.92267C10.007 7.03301 10.2858 7.22054 10.5055 7.46776C10.7252 7.71497 10.8787 8.01382 10.9517 8.33642C11.0247 8.65902 11.0148 8.99485 10.9229 9.31258C10.831 9.63031 10.6601 9.91958 10.4262 10.1534L9.49701 11.0421M8.25792 6.72607L7.30937 7.73554C7.07543 7.96936 6.90454 8.25863 6.81264 8.57636C6.72073 8.89408 6.71081 9.22992 6.78381 9.55251C6.8568 9.87511 7.01032 10.174 7.23005 10.4212C7.44978 10.6684 7.72855 10.8559 8.04036 10.9663" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
    <defs>
    <filter id="filter0_d" x="0" y="0" width="18" height="18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="2"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.137674 0 0 0 0 0.190937 0 0 0 0 0.270833 0 0 0 0.15 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
    </filter>
    </defs>
  </svg>
  `);
const rotateIcon = `data:image/svg+xml;utf8,${svgRotateIcon}`;
const imgIconRotate = document.createElement("img");
imgIconRotate.src = rotateIcon;

var deleteImg = document.createElement("img");
deleteImg.src = deleteIcon;

var cloneImg = document.createElement("img");
cloneImg.src = cloneIcon;

var pillarIconImg = document.createElement("img");
pillarIconImg.src = pillarIcon;

var decorativeiconImg = document.createElement("img");
decorativeiconImg.src = decorativeicon;

const addCircleTriangle = (
  left,
  top,
  width,
  height,
  radius,
  number_table,
  number_table_with_t,
  scaleX_position,
  scaley_position,
  angle_position,
  blocked_status,
  available_online,
  min_person,
  preferred_person,
  max_person,
  priority_level,
  add_type,
  position_fix,
  booking_status = "0",
  type_name,
  selected_canvas
) => {
  let g;
  let lock_status = false;
  let fillColor = tableFill_main;
  let person_call = "F-" + preferred_person + "P";
  if (booking_status === 1) {
    fillColor = ready_for_allot;
  }
  if (booking_status === 2) {
    fillColor = runining_table;
  }
  if (blocked_status === blocked_main) {
    fillColor = blocked_status;
    lock_status = true;
  }

  if (selected_canvas != "") {
    fillColor = selected_table;
  }

  const common = {
    fill: fillColor,
    strokeWidth: 2,
    originX: "center",
    originY: "center",
    centeredRotation: true,
    hasBorders: false,
  };
  const common_bar_bar = {
    fill: barFill_main,
    strokeWidth: 2,
    originX: "center",
    originY: "center",
    centeredRotation: true,
  };

  const IText_t_common = {
    fontFamily: "Calibri",
    fontSize: 15,
    fill: white_main,
    textAlign: "center",
    originX: "center",
    originY: "center",
  };

  const IText_p0_common = {
    fontFamily: "Calibri",
    fontSize: 15,
    fill: white_main,
    textAlign: "center",
    originX: "center",
    originY: "center",
  };

  let Group_g_common = {
    left: left,
    top: top,
    centeredRotation: true,
    snapAngle: 45,
    selectable: true,
    id: number_table,
    globalCompositeOperation:
      number_table +
      "@@@" +
      available_online +
      "@@@" +
      min_person +
      "@@@" +
      preferred_person +
      "@@@" +
      max_person +
      "@@@" +
      priority_level +
      "@@@" +
      type_name,
    number: number_table,
    scaleX: scaleX_position,
    scaleY: scaley_position,
    blocked: lock_status,
    angle: angle_position,
  };

  if (add_type === "pillar" || add_type === "decorative") {
    Group_g_common = {
      left: left,
      top: top,
      centeredRotation: true,
      snapAngle: 45,
      selectable: true,
      id: number_table,
      globalCompositeOperation:
        number_table +
        "@@@" +
        available_online +
        "@@@" +
        min_person +
        "@@@" +
        preferred_person +
        "@@@" +
        max_person +
        "@@@" +
        priority_level +
        "@@@" +
        type_name +
        "@@@" +
        add_type +
        "@@@" +
        fillColor,
      number: number_table,
      scaleX: scaleX_position,
      scaleY: scaley_position,
      blocked: lock_status,
      angle: angle_position,
    };
  }

  const common_bar = {
    width: width,
    height: height,
    fill: barFill_main,
    strokeWidth: 2,
    originX: "center",
    originY: "center",
  };

  const common_counter = {
    width: 20,
    height: 50,
    fill: barFill_main, // Customize the fill color for the stool seat
    strokeWidth: 2,
    type: "counter",
    selectable: false,
  };

  let o;
  let t;
  let p0;

  if (add_type === "circle") {
    o = new fabric.Circle({
      radius: radius,
      ...common,
    });
    t = new fabric.IText(number_table_with_t, {
      ...IText_t_common,
      top: -6,
    });
    p0 = new fabric.IText(person_call, {
      ...IText_p0_common,
      top: 10,
    });
  } else if (add_type === "triangle") {
    o = new fabric.Triangle({
      radius: radius,
      ...common,
    });

    t = new fabric.IText(number_table_with_t, {
      ...IText_t_common,
      top: 1,
    });

    p0 = new fabric.IText(person_call, {
      ...IText_p0_common,
      top: 15,
    });
  } else if (add_type === "square_table") {
    //console.log(check_which_one);
    var iconWidth = 70; // Adjust based on the width of your icon
    var iconHeight = 110; // Adjust based on the height of your icon
    let left_icon = 0; // Adjust based on the height of your icon
    var top_icon = 0;
    const imgElement = new Image();
    imgElement.onload = function () {
      const fabricImage = new fabric.Image(imgElement, {
        left: left_icon,
        top: top_icon,
        width: iconWidth,
        height: iconHeight,
      });

      // Create the first text object
      const text1 = new fabric.Text(number_table_with_t, {
        fontSize: 18, // Adjust font size as needed
        fill: "black", // Text color
        originX: "center",
        originY: "center",
        left: left_icon + iconWidth / 2, // Center text in the image
        top: top_icon + iconHeight / 3, // Position the first line
      });

      // Create the second text object
      const text2 = new fabric.Text(number_table_with_t, {
        fontSize: 18, // Adjust font size as needed
        fill: "black", // Text color
        originX: "center",
        originY: "center",
        left: left_icon + iconWidth / 2, // Center text in the image
        top: top_icon + (iconHeight / 3) * 2, // Position the second line below the first
      });

      // Group the image and the texts
      const group = new fabric.Group([fabricImage, text1, text2], {
        left: left_icon,
        top: top_icon,
        angle: 0,
        scaleX: scaleX_position,
        scaleY: scaley_position,
        originX: "left",
        originY: "top",
      });

      //canvas.add(group).setActiveObject(group);
    };
    //imgElement.src = chair_img;
  } else if (add_type === "bar") {
    o = new fabric.Rect({
      type: "bar",
      ...common_bar,
    });

    t = new fabric.IText(number_table_with_t, {
      ...IText_t_common,
    });
  } else if (add_type === "counter") {
    o = new fabric.Rect({
      width: width,
      height: 20,
      type: "counter",
      selectable: false,
      ...common_bar_bar,
    });

    t = new fabric.Rect({
      ...common_counter,
      left: width / 2 - 21,
    });

    p0 = new fabric.Rect({
      ...common_counter,
      left: -width / 2 - 1,
    });
  } else if (add_type === "decorative") {
    g = new fabric.Image(decorativeiconImg, {
      ...Group_g_common,
    });
    g.setControlVisible("deleteControl", true);
  } else if (add_type === "pillar") {
    g = new fabric.Image(pillarIconImg, {
      ...Group_g_common,
    });

    g.setControlVisible("deleteControl", true);
  }

  if (
    add_type === "circle" ||
    add_type === "triangle" ||
    add_type === "square_table"
  ) {
    g = new fabric.Group([o, t, p0], {
      ...Group_g_common,
      type: "table",
    });
    g.setControlVisible("deleteControl", false);
  } else if (add_type === "bar") {
    g = new fabric.Group([o, t], {
      ...Group_g_common,
      type: "bar",
    });
    g.setControlVisible("deleteControl", true);
  } else if (add_type === "counter") {
    g = new fabric.Group([o, t, p0], {
      ...Group_g_common,
      type: "counter",
    });
    g.setControlVisible("deleteControl", true);
  }

  g.set({
    borderColor: borderColor,
    cornerColor: cornerColor,
    cornerSize: 7,
    transparentCorners: false,
    lockRotation: false,
    padding: 7,
    cornerStyle: "circle",
    borderDashArray: [5, 5],
  });

  if (position_fix) {
    lock_status = position_fix;
    g.setControlsVisibility({
      tl: false, // Top-left control
      tr: false, // Top-right control
      br: false, // Bottom-right control
      bl: false, // Bottom-left control
      ml: false, // Middle-left control
      mt: false, // Middle-top control
      mr: false, // Middle-right control
      mb: false, // Middle-bottom control
      mtr: false, // Rotation control
    });
  }

  g.setControlsVisibility({
    mtr: true, // Rotation control
  });

  g.set({
    lockMovementX: lock_status,
    lockMovementY: lock_status,
  });
  return g;
};

const createImageWithTextGroup = (
  left,
  top,
  width,
  height,
  radius,
  number_table,
  number_table_with_t,
  scaleX_position,
  scaleY_position,
  angle_position,
  blocked_status,
  available_online,
  min_person,
  preferred_person,
  max_person,
  priority_level,
  add_type,
  position_fix,
  booking_status = "0",
  type_name,
  selected_canvas,
  chair_img,
  table_type_with_chair
) => {
  let table_type;
  if (add_type === "circle") {
    table_type = add_type;
  } else {
    table_type = "rect";
  }

  return new Promise(async (resolve, reject) => {
    try {
      let g;
      let lock_status = false;
      let fillColor = tableFill_main;
      let person_call = "F-" + preferred_person + "P";

      if (booking_status === 1) {
        fillColor = ready_for_allot;
      }
      if (booking_status === 2) {
        fillColor = running_table;
      }
      if (blocked_status === blocked_main) {
        fillColor = blocked_status;
        lock_status = true;
      }
      if (selected_canvas !== "") {
        fillColor = selected_table;
      }

      // Calculate text size based on scaling
      const textScaleFactor = Math.min(scaleX_position, scaleY_position);
      const textSize = 15 * textScaleFactor; // Adjust base font size as needed

      const IText_t_common = {
        fontFamily: "Calibri",
        fontSize: textSize,
        fill: white_main,
        textAlign: "center",
        originX: "center",
        originY: "center",
      };

      const IText_p0_common = {
        fontFamily: "Calibri",
        fontSize: textSize,
        fill: white_main,
        textAlign: "center",
        originX: "center",
        originY: "center",
      };

      let Group_g_common = {
        left: left,
        top: top,
        centeredRotation: true,
        snapAngle: 45,
        selectable: true,
        id: number_table,
        globalCompositeOperation:
          number_table +
          "@@@" +
          available_online +
          "@@@" +
          min_person +
          "@@@" +
          preferred_person +
          "@@@" +
          max_person +
          "@@@" +
          priority_level +
          "@@@" +
          type_name +
          "@@@" +
          table_type_with_chair +
          "@@@" +
          fillColor,
        number: number_table,
        scaleX: scaleX_position,
        scaleY: scaleY_position,
        blocked: lock_status,
        angle: angle_position,
        CustomColor: fillColor,
      };

      const imgElement = new Image();
      let image_convert = await SvgimageChange(chair_img, fillColor, 0);
      let image_convert_normal = await SvgimageChange(chair_img, "", 0);
      let image_convert_link = await SvgimageChange(chair_img, fillColor, 1);

      imgElement.onload = function () {
        const fabricImage = new fabric.Image(imgElement, {
          left: left,
          top: top,
          angle: 0,
          scaleX: scaleX_position, // Use scale factors directly
          scaleY: scaleY_position, // Use scale factors directly
          opacity: 1,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          borderColor: "blue",
          cornerColor: "red",
          cornerSize: 6,
          transparentCorners: false,
          type: table_type,
          originX: "left",
          originY: "top",
          imgSrc: chair_img,
          OriginalSrc: image_convert_normal,
          OriginalSrcChange: image_convert,
        });

        // Center the text within the table
        const centerX = left + (width * scaleX_position) / 2;
        const centerY = top + (height * scaleY_position) / 2;

        // Calculate space between texts
        const verticalSpacing = textSize; // Adjust spacing as needed

        const text1 = new fabric.Text(number_table_with_t, {
          ...IText_t_common,
          left: centerX,
          top: centerY - verticalSpacing / 2, // Position text1
        });

        const text2 = new fabric.Text(person_call, {
          ...IText_p0_common,
          left: centerX,
          top: centerY + verticalSpacing / 2, // Position text2
        });

        const g = new fabric.Group([fabricImage, text1, text2], {
          ...Group_g_common,
          left: left,
          top: top,
          angle: 0,
          type: "table",
          originX: "left",
          originY: "top",
        });

        g.setControlVisible("deleteControl", false);
        g.set({
          borderColor: borderColor,
          cornerColor: cornerColor,
          cornerSize: 7,
          transparentCorners: false,
          lockRotation: false,
          padding: 7,
          cornerStyle: "circle",
          borderDashArray: [5, 5],
        });

        if (position_fix) {
          lock_status = position_fix;
          g.setControlsVisibility({
            tl: false,
            tr: false,
            br: false,
            bl: false,
            ml: false,
            mt: false,
            mr: false,
            mb: false,
            mtr: false,
          });
        }

        g.setControlsVisibility({
          mtr: true,
        });

        g.set({
          lockMovementX: lock_status,
          lockMovementY: lock_status,
        });
        resolve(g);
      };

      imgElement.onerror = function (err) {
        console.error("Image load error:", err);
        reject(err);
      };

      imgElement.src = image_convert_link;
    } catch (err) {
      console.error("Failed to create group:", err);
      reject(err);
    }
  });
};

const SvgimageChange = (imgSrc, fillColor, flag) => {
  return new Promise((resolve, reject) => {
    fetch(imgSrc)
      .then((response) => response.text())
      .then((svgData) => {
        if (fillColor != "") {
          svgData = svgData.replace(/fill="[^"]*"/g, `fill="${fillColor}"`);
        }
        if (flag === 1) {
          // Convert the SVG data to a base64-encoded data URL
          const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
          };

          reader.onerror = (err) => {
            console.error("Failed to convert SVG data to base64:", err);
            reject(err);
          };

          reader.readAsDataURL(svgBlob);
        } else {
          resolve(svgData);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch or modify the SVG data:", err);
        reject(err);
      });
  });
};

export {
  addCircleTriangle,
  createImageWithTextGroup,
  barFill_main,
  tableFill_main,
  backgroundColor_main,
  blocked_main,
  white_main,
  runining_table,
  walking_table,
  selected_table,
  offline_table,
  tableFill_main_dark,
  ready_for_allot,
  cloneImg,
  deleteImg,
  imgIconRotate,
  borderColor,
  scrollLimitCanvas,
  initialViewportTransform,
  cornerColor,
};
