import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const SphereComponent = () => {
  const mountRef = useRef(null);
  const [rotateSphere, setRotateSphere] = useState(true);
  const [clickedColor, setClickedColor] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const apiKey = 'pataA6XkFDpr1EVgr.d732740092449c124dfd4f6d4fcbeac1b12307250f32a2b71a51670e376b5a5f';
        const baseId = 'appJW40c4Yo0kLai0';
        const tableName = 'Table 2';
        const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        const data = await response.json();
        console.log(data)

        // renderDataOnSphere(data.records);
      } catch (error) {
        console.error('Error fetching data from Airtable:', error);
      }
    };



    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add sphere
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Add colors to the vertices
    const colors = [];
    const positionAttribute = sphereGeometry.attributes.position;

    // Define the color stops of the gradient at different heights
    const colorStops = [
      new THREE.Color(0xFF0000), // Red at the bottom
      new THREE.Color(0x23ed00), // Orange
      new THREE.Color(0x93250D), // Yellow
      new THREE.Color(0x008E89),
      new THREE.Color(0x008E89), // Red at the bottom
      new THREE.Color(0x68F705), // Orange 
    ];



    // Calculate the bounds (min/max) of the Y position
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < positionAttribute.count; i++) {
      const y = positionAttribute.getY(i);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    // Assign color based on Y position
    console.log(positionAttribute.count)
    for (let i = 0; i < positionAttribute.count; i++) {
      console.log(positionAttribute.getY(i))

      const y = positionAttribute.getY(i);
      const normalizedY = (y - minY) / (maxY - minY); // Normalize Y to 0-1
      const colorIndex = Math.round(normalizedY * (colorStops.length - 1));
      console.log(colorIndex)
      const vertexColor = colorStops[colorIndex];
      colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
    }

    sphereGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    camera.position.z = 10;

    // Animation loop
    const animate = () => {
      if (rotateSphere) {
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
      }
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle browser resizing
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    // Handle click on the sphere
    const handleSphereClick = (event) => {

      setRotateSphere(true); // Toggle rotation on click

      // Calculate normalized device coordinates
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Set up raycaster
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections
      const intersects = raycaster.intersectObject(sphere);


      if (intersects.length > 0) {

        const vertexIndex = intersects[0].face.a;
        const colorArray = sphere.geometry.attributes.color.array;
        console.log(vertexIndex)

        // Calculate color index
        const colorIndex = vertexIndex * 3; // Each vertex has three color components (r, g, b)

        // Get the color at the clicked vertex
        const vertexColor = new THREE.Color(
          colorArray[colorIndex],
          colorArray[colorIndex + 1],
          colorArray[colorIndex + 2]
        );

        const redComponent = vertexColor.r; // Red component
        const greenComponent = vertexColor.g; // Green component
        const blueComponent = vertexColor.b; // Blue component

        console.log("Red:", redComponent);
        console.log("Green:", greenComponent);
        console.log("Blue:", blueComponent);

        const redValue = Math.round(redComponent * 255);
        const greenValue = Math.round(greenComponent * 255);
        const blueValue = Math.round(blueComponent * 255);

        const hexColor = `#${redValue.toString(16).padStart(2, '0')}${greenValue.toString(16).padStart(2, '0')}${blueValue.toString(16).padStart(2, '0')}`;

        console.log("Hex Color:", hexColor);

        console.log('Color Index:', colorIndex); // Divide by 3 to get the actual color index
        console.log('Color:', vertexColor);
        // alert(`Color Index: ${colorIndex / 3}`);

        // Get the color at the clicked vertex
        // const vertexColor = new THREE.Color(
        //   color.getX(vertexIndex),
        //   color.getY(vertexIndex),
        //   color.getZ(vertexIndex)
        // );

        // Stop rotation and set the sphere's color
        // setRotateSphere(false);
        // setClickedColor(vertexColor);
        // sphereMaterial.color.set(vertexColor);

        // const clickedColorStop = colorStops.find(color => color.equals(vertexColor));

        // if (clickedColorStop) {
        //   // Display alert with color information
        //  console.log(clickedColorStop)
        // }

      }


      var range = [
        "Financial and Insurance",  // Red
        "Sustainability",    // Green
        "Education",     // Blue
        "Human Resources",
        "Advisory Services",
        "Legal",
        "Policy",
      ]
      var number = ((Math.random() * 6) + 1).toFixed()
      console.log(number)




      // Sphere is clicked, show tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.style.position = 'absolute';
      tooltip.style.backgroundColor = '#fff'; // Set background color
      tooltip.style.width = '150px'; // Set width
      tooltip.style.height = '50px'; // Set height
      tooltip.style.borderRadius = '8px'; // Set border radius
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY}px`;
      tooltip.textContent = 'Sphere Clicked!';
      tooltip.style.paddingLeft = "2%"
      tooltip.textContent = `${range[number]}`;

      // Check if mountRef.current is not null before appending the tooltip
      if (mountRef.current) {

        mountRef.current.appendChild(tooltip);

        // Remove tooltip after a delay
        setTimeout(() => {
          if (mountRef.current) {
            mountRef.current.removeChild(tooltip);
          }
        }, 1000);
      }
    };

    const getColorName = (color) => {
      const colorIndex = colorStops.findIndex(stopColor => stopColor.equals(color));
      if (colorIndex !== -1) {
        return `Color ${colorIndex + 1}`;
      } else {
        return 'Unknown Color';
      }
    };


    // Add click event listener to the renderer
    renderer.domElement.addEventListener('click', handleSphereClick);

    fetchData()

    // Cleanup
    return () => {
      // Check if mountRef.current is not null before removing the child
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // sphereGeometry.dispose();
      // sphereMaterial.dispose();
      // renderer.dispose();
      // Remove click event listener on cleanup
      renderer.domElement.removeEventListener('click', handleSphereClick);
    };
  }, [rotateSphere]);



  return <div ref={mountRef} />;
};

export default SphereComponent;