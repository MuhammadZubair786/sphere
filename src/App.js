import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const SphereComponent = () => {
  const mountRef = useRef(null);
  const [rotateSphere, setRotateSphere] = useState(true);
  const [clickedColor, setClickedColor] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      // try {
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
        console.log(data);

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
          new THREE.Color(0x68F70), //
        ];

        // Calculate the bounds (min/max) of the Y position
        let minY = Infinity;
        let maxY = -Infinity;

        for (let i = 0; i < data.records.length; i++) {
          const record = data.records[i];
          const y = parseFloat(40); // Replace 'height' with the actual field name in your Airtable data
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }

        // Assign color based on Y position
        for (let i = 0; i < data.records.length; i++) {
          const record = data.records[i];
          const y = parseFloat(40);
          const normalizedY = (y - minY) / (maxY - minY); // Normalize Y to 0-1
          const colorIndex = Math.round(normalizedY * (colorStops.length - 1));
          console.log(colorIndex)
          const vertexColor = colorStops[colorIndex];
          console.log(vertexColor)
          // colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
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
      // } catch (error) {
      //   console.error('Error fetching data from Airtable:', error);
      // }
    };

    fetchData();

  }, [rotateSphere]);

  return <div ref={mountRef} />;
};

export default SphereComponent;
