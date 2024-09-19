"use strict";


function parseOBJ(text) {
  
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];
  const objColors = [[0, 0, 0]];

 
  const objVertexData = [
    objPositions,
    objTexcoords,
    objNormals,
    objColors,
  ];


  let webglVertexData = [
    [],   // posicao
    [],   // textura
    [],   // normal
    [],   // cor
  ];

  const materialLibs = [];
  const geometries = [];
  let geometry;
  let groups = ['default'];
  let material = 'default';
  let object = 'default';

  const noop = () => {};

  function newGeometry() {

    if (geometry && geometry.data.position.length) {
      geometry = undefined;
    }
  }

  function setGeometry() {
    if (!geometry) {
      const position = [];
      const texcoord = [];
      const normal = [];
      const color = [];
      webglVertexData = [
        position,
        texcoord,
        normal,
        color,
      ];
      geometry = {
        object,
        groups,
        material,
        data: {
          position,
          texcoord,
          normal,
          color,
        },
      };
      geometries.push(geometry);
    }
  }

  function addVertex(vert) {
    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
 
      if (i === 0 && objColors.length > 1) {
        geometry.data.color.push(...objColors[index]);
      }
    });
  }

  const keywords = {
    v(parts) {

      if (parts.length > 3) {
        objPositions.push(parts.slice(0, 3).map(parseFloat));
        objColors.push(parts.slice(3).map(parseFloat));
      } else {
        objPositions.push(parts.map(parseFloat));
      }
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
  
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      setGeometry();
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
    s: noop,    
    mtllib(parts, unparsedArgs) {

      materialLibs.push(unparsedArgs);
    },
    usemtl(parts, unparsedArgs) {
      material = unparsedArgs;
      newGeometry();
    },
    g(parts) {
      groups = parts;
      newGeometry();
    },
    o(parts, unparsedArgs) {
      object = unparsedArgs;
      newGeometry();
    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  
      continue;
    }
    handler(parts, unparsedArgs);
  }

  // remove vetor vazio
  for (const geometry of geometries) {
    geometry.data = Object.fromEntries(
        Object.entries(geometry.data).filter(([, array]) => array.length > 0));
  }

  return {
    geometries,
    materialLibs,
  };
}

function parseMapArgs(unparsedArgs) {
  return unparsedArgs;
}

function parseMTL(text) {
  const materials = {};
  let material;

  const keywords = {
    newmtl(parts, unparsedArgs) {
      material = {};
      materials[unparsedArgs] = material;
    },
    /* eslint brace-style:0 */
    Ns(parts)       { material.shininess      = parseFloat(parts[0]); },
    Ka(parts)       { material.ambient        = parts.map(parseFloat); },
    Kd(parts)       { material.diffuse        = parts.map(parseFloat); },
    Ks(parts)       { material.specular       = parts.map(parseFloat); },
    Ke(parts)       { material.emissive       = parts.map(parseFloat); },
    map_Kd(parts, unparsedArgs)   { material.diffuseMap = parseMapArgs(unparsedArgs); },
    map_Ns(parts, unparsedArgs)   { material.specularMap = parseMapArgs(unparsedArgs); },
    map_Bump(parts, unparsedArgs) { material.normalMap = parseMapArgs(unparsedArgs); },
    Ni(parts)       { material.opticalDensity = parseFloat(parts[0]); },
    d(parts)        { material.opacity        = parseFloat(parts[0]); },
    illum(parts)    { material.illum          = parseInt(parts[0]); },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  return materials;
}

function somaVetores(a, b, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(3);
  vetorDestino[0] = a[0] + b[0];
  vetorDestino[1] = a[1] + b[1];
  vetorDestino[2] = a[2] + b[2];
  return vetorDestino;
}

function subtraiVetores(a, b, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(3);
  vetorDestino[0] = a[0] - b[0];
  vetorDestino[1] = a[1] - b[1];
  vetorDestino[2] = a[2] - b[2];
  return vetorDestino;
}


function escalaVetor(v, s, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(3);
  vetorDestino[0] = v[0] * s;
  vetorDestino[1] = v[1] * s;
  vetorDestino[2] = v[2] * s;
  return vetorDestino;
}

function length(vetor) {
  return Math.sqrt(vetor[0] * vetor[0] + vetor[1] * vetor[1] + vetor[2] * vetor[2]);
}

function perspectiva(fieldOfViewInRadians, aspect, near, far, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(16);
  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  var rangeInv = 1.0 / (near - far);

  vetorDestino[ 0] = f / aspect;
  vetorDestino[ 1] = 0;
  vetorDestino[ 2] = 0;
  vetorDestino[ 3] = 0;
  vetorDestino[ 4] = 0;
  vetorDestino[ 5] = f;
  vetorDestino[ 6] = 0;
  vetorDestino[ 7] = 0;
  vetorDestino[ 8] = 0;
  vetorDestino[ 9] = 0;
  vetorDestino[10] = (near + far) * rangeInv;
  vetorDestino[11] = -1;
  vetorDestino[12] = 0;
  vetorDestino[13] = 0;
  vetorDestino[14] = near * far * rangeInv * 2;
  vetorDestino[15] = 0;

  return vetorDestino;
}

function normaliza(v, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(3);
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    vetorDestino[0] = v[0] / length;
    vetorDestino[1] = v[1] / length;
    vetorDestino[2] = v[2] / length;
  }
  return vetorDestino;
}

function lookAt(cameraPosition, target, up, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(16);
  var zAxis = normaliza(
  subtraiVetores(cameraPosition, target));
  var xAxis = normaliza(produtoVetorial(up, zAxis));
  var yAxis = normaliza(produtoVetorial(zAxis, xAxis));

  vetorDestino[ 0] = xAxis[0];
  vetorDestino[ 1] = xAxis[1];
  vetorDestino[ 2] = xAxis[2];
  vetorDestino[ 3] = 0;
  vetorDestino[ 4] = yAxis[0];
  vetorDestino[ 5] = yAxis[1];
  vetorDestino[ 6] = yAxis[2];
  vetorDestino[ 7] = 0;
  vetorDestino[ 8] = zAxis[0];
  vetorDestino[ 9] = zAxis[1];
  vetorDestino[10] = zAxis[2];
  vetorDestino[11] = 0;
  vetorDestino[12] = cameraPosition[0];
  vetorDestino[13] = cameraPosition[1];
  vetorDestino[14] = cameraPosition[2];
  vetorDestino[15] = 1;

  return vetorDestino;
}

function inverte(m, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(16);
  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];
  var tmp_0  = m22 * m33;
  var tmp_1  = m32 * m23;
  var tmp_2  = m12 * m33;
  var tmp_3  = m32 * m13;
  var tmp_4  = m12 * m23;
  var tmp_5  = m22 * m13;
  var tmp_6  = m02 * m33;
  var tmp_7  = m32 * m03;
  var tmp_8  = m02 * m23;
  var tmp_9  = m22 * m03;
  var tmp_10 = m02 * m13;
  var tmp_11 = m12 * m03;
  var tmp_12 = m20 * m31;
  var tmp_13 = m30 * m21;
  var tmp_14 = m10 * m31;
  var tmp_15 = m30 * m11;
  var tmp_16 = m10 * m21;
  var tmp_17 = m20 * m11;
  var tmp_18 = m00 * m31;
  var tmp_19 = m30 * m01;
  var tmp_20 = m00 * m21;
  var tmp_21 = m20 * m01;
  var tmp_22 = m00 * m11;
  var tmp_23 = m10 * m01;

  var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

  var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

  vetorDestino[0] = d * t0;
  vetorDestino[1] = d * t1;
  vetorDestino[2] = d * t2;
  vetorDestino[3] = d * t3;
  vetorDestino[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
  vetorDestino[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
  vetorDestino[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
  vetorDestino[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
  vetorDestino[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
  vetorDestino[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
  vetorDestino[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
  vetorDestino[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
  vetorDestino[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
  vetorDestino[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
  vetorDestino[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
  vetorDestino[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

  return vetorDestino;
}

function yRotacao(angulo, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(16);
  var c = Math.cos(angulo);
  var s = Math.sin(angulo);

  vetorDestino[ 0] = c;
  vetorDestino[ 1] = 0;
  vetorDestino[ 2] = -s;
  vetorDestino[ 3] = 0;
  vetorDestino[ 4] = 0;
  vetorDestino[ 5] = 1;
  vetorDestino[ 6] = 0;
  vetorDestino[ 7] = 0;
  vetorDestino[ 8] = s;
  vetorDestino[ 9] = 0;
  vetorDestino[10] = c;
  vetorDestino[11] = 0;
  vetorDestino[12] = 0;
  vetorDestino[13] = 0;
  vetorDestino[14] = 0;
  vetorDestino[15] = 1;

  return vetorDestino;
}


function rotacaoXYZ(anguloX, anguloY, anguloZ, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(16);
  
  // Matrizes de rotação individuais
  var rotX = xRotacao(anguloX, new Float32Array(16));
  var rotY = yRotacao(anguloY, new Float32Array(16));
  var rotZ = zRotacao(anguloZ, new Float32Array(16));

  // Multiplicação das matrizes: rotZ * rotY * rotX
  for (var i = 0; i < 16; i++) {
    vetorDestino[i] = rotZ[i] * rotY[i] * rotX[i];
  }

  return vetorDestino;
}

function rotacaoEmTodosEixos(anguloX, anguloY, anguloZ, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(16);

  var cx = Math.cos(anguloX), sx = Math.sin(anguloX);
  var cy = Math.cos(anguloY), sy = Math.sin(anguloY);
  var cz = Math.cos(anguloZ), sz = Math.sin(anguloZ);

  // Matriz de rotação composta:
  vetorDestino[ 0] = cy * cz;
  vetorDestino[ 1] = sx * sy * cz + cx * sz;
  vetorDestino[ 2] = -cx * sy * cz + sx * sz;
  vetorDestino[ 3] = 0;

  vetorDestino[ 4] = -cy * sz;
  vetorDestino[ 5] = -sx * sy * sz + cx * cz;
  vetorDestino[ 6] = cx * sy * sz + sx * cz;
  vetorDestino[ 7] = 0;

  vetorDestino[ 8] = sy;
  vetorDestino[ 9] = -sx * cy;
  vetorDestino[10] = cx * cy;
  vetorDestino[11] = 0;

  vetorDestino[12] = 0;
  vetorDestino[13] = 0;
  vetorDestino[14] = 0;
  vetorDestino[15] = 1;

  return vetorDestino;
}




function translate(m, tx, ty, tz, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(16);

  var m00 = m[0];
  var m01 = m[1];
  var m02 = m[2];
  var m03 = m[3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];

  if (m !== vetorDestino){
    vetorDestino[ 0] = m00;
    vetorDestino[ 1] = m01;
    vetorDestino[ 2] = m02;
    vetorDestino[ 3] = m03;
    vetorDestino[ 4] = m10;
    vetorDestino[ 5] = m11;
    vetorDestino[ 6] = m12;
    vetorDestino[ 7] = m13;
    vetorDestino[ 8] = m20;
    vetorDestino[ 9] = m21;
    vetorDestino[10] = m22;
    vetorDestino[11] = m23;
  }

  vetorDestino[12] = m00 * tx + m10 * ty + m20 * tz + m30;
  vetorDestino[13] = m01 * tx + m11 * ty + m21 * tz + m31;
  vetorDestino[14] = m02 * tx + m12 * ty + m22 * tz + m32;
  vetorDestino[15] = m03 * tx + m13 * ty + m23 * tz + m33;

  return vetorDestino;
}

function produtoVetorial(a, b, vetorDestino) {
  vetorDestino = vetorDestino || new Float32Array(3);
  vetorDestino[0] = a[1] * b[2] - a[2] * b[1];
  vetorDestino[1] = a[2] * b[0] - a[0] * b[2];
  vetorDestino[2] = a[0] * b[1] - a[1] * b[0];
  return vetorDestino;
}



async function main() {
  // contexto webgl
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  gl.clearColor(0.75, 0, 0.75, 0.5);  

  
  twgl.setAttributePrefix("a_");

  const vs = `#version 300 es
  in vec4 a_position;
  in vec3 a_normal;
  in vec2 a_texcoord;
  in vec4 a_color;

  uniform mat4 u_projection;
  uniform mat4 u_view;
  uniform mat4 u_world;
  uniform vec3 u_viewWorldPosition;

  out vec3 v_normal;
  out vec3 v_surfaceToView;
  out vec2 v_texcoord;
  out vec4 v_color;

  void main() {
    vec4 worldPosition = u_world * a_position;
    gl_Position = u_projection * u_view * worldPosition;
    v_surfaceToView = u_viewWorldPosition - worldPosition.xyz;
    v_normal = mat3(u_world) * a_normal;
    v_texcoord = a_texcoord;
    v_color = a_color;
  }
  `;

  const fs = `#version 300 es
  precision highp float;

  in vec3 v_normal;
  in vec3 v_surfaceToView;
  in vec2 v_texcoord;
  in vec4 v_color;

  uniform vec3 diffuse;
  uniform sampler2D diffuseMap;
  uniform vec3 ambient;
  uniform vec3 emissive;
  uniform vec3 specular;
  uniform float shininess;
  uniform float opacity;
  uniform vec3 u_lightDirection;
  uniform vec3 u_ambientLight;

  out vec4 outColor;

  void main () {
    vec3 normal = normalize(v_normal);

    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(u_lightDirection + surfaceToViewDirection);

    float fakeLight = dot(u_lightDirection, normal) * .5 + .5;
    float specularLight = clamp(dot(normal, halfVector), 0.0, 1.0);

    vec4 diffuseMapColor = texture(diffuseMap, v_texcoord);
    vec3 effectiveDiffuse = diffuse * diffuseMapColor.rgb * v_color.rgb;
    float effectiveOpacity = opacity * diffuseMapColor.a * v_color.a;

    outColor = vec4(
        emissive +
        ambient * u_ambientLight +
        effectiveDiffuse * fakeLight +
        specular * pow(specularLight, shininess),
        effectiveOpacity);
  }
  `;


  const meshProgramInfo = twgl.createProgramInfo(gl, [vs, fs]);

  const objHref = 'obj/jorgin.obj';
  const objHref2 = 'obj/banana.obj';

  const response = await fetch(objHref);
  const response2 = await fetch(objHref2);

  const text = await response.text();
  const text2 = await response2.text();


  const obj = parseOBJ(text);
  const obj2 = parseOBJ(text2);

  const matTexts = await Promise.all(obj.materialLibs.map(async filename => {
    const matHref = 'obj/jorgin.mtl';
    const response = await fetch(matHref);
    return await response.text();
  }));
  const matTexts2 = await Promise.all(obj2.materialLibs.map(async filename => {
    const matHref2 = 'obj/banana.mtl';
    const response2 = await fetch(matHref2);
    return await response2.text();
  }));


  const materials = parseMTL(matTexts.join('\n'));
  const materials2 = parseMTL(matTexts2.join('\n'));


  const textures = {
    defaultWhite: twgl.createTexture(gl, {src: [255, 255, 255, 255]}),
  };
  const textures2 = {
    defaultWhite: twgl.createTexture(gl, {src: [255, 255, 255, 255]}),
  };

  // carrega text material obj 1
  for (const material of Object.values(materials)) {
    Object.entries(material)
      .filter(([key]) => key.endsWith('Map'))
      .forEach(([key, filename]) => {
        let texture = textures[filename];
        if (!texture) {
          const textureHref = 'obj/jorgin_texture.png';
          texture = twgl.createTexture(gl, {src: textureHref, flipY: true});
          textures[filename] = texture;
        }
        material[key] = texture;
      });
  }

  // carrega text material obj 2
for (const material2 of Object.values(materials2)) {
    Object.entries(material2)
      .filter(([key]) => key.endsWith('Map'))
      .forEach(([key, filename]) => {
        let texture2 = textures2[filename];
        if (!texture2) {
          const textureHref2 = 'obj/banana_texture.png';
          texture2 = twgl.createTexture(gl, {src: textureHref2, flipY: true});
          textures2[filename] = texture2;
        }
        material2[key] = texture2;
      });
  }
  

  const defaultMaterial = {
    diffuse: [1, 1, 1],
    diffuseMap: textures.defaultWhite,
    ambient: [0, 0, 0],
    specular: [1, 1, 1],
    shininess: 400,
    opacity: 1,
  };


  //Criar o bufferinfo dos dois .obj
  const parts = obj.geometries.map(({material, data}) => { 

    if (data.color) {
      if (data.position.length === data.color.length) {

        data.color = { numComponents: 7, data: data.color };
      }
    } else {
      // there are no vertex colors so just use constant white
      data.color = { value: [1, 1, 1, 1] };
    }

    console.log(data);
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, data);
    const vao = twgl.createVAOFromBufferInfo(gl, meshProgramInfo, bufferInfo);
    return {
      material: {
        ...defaultMaterial,
        ...materials[material],
      },
      bufferInfo,
      vao,
    };
  });
  

  const parts2 = obj2.geometries.map(({material, data}) => { 

    if (data.color) {
      if (data.position.length === data.color.length) {

        data.color = { numComponents: 3, data: data.color };
      }
    } else {
      // there are no vertex colors so just use constant white
      data.color = { value: [1, 1, 1, 1] };
    }


    const bufferInfo = twgl.createBufferInfoFromArrays(gl, data);
    const vao = twgl.createVAOFromBufferInfo(gl, meshProgramInfo, bufferInfo);    
    return {
      material: {
        ...defaultMaterial,
        ...materials2[material],
      },
      bufferInfo,
      vao,
    };
  });

  console.log(parts);
  console.log(parts2); 

  
  

  function getExtents(positions) {
    const min = positions.slice(0, 3);
    const max = positions.slice(0, 3);
    for (let i = 3; i < positions.length; i += 3) {
      for (let j = 0; j < 3; ++j) {
        const v = positions[i + j];
        min[j] = Math.min(v, min[j]);
        max[j] = Math.max(v, max[j]);
      }
    }
    return {min, max};
  }

  function getGeometriesExtents(geometries) {
    return geometries.reduce(({min, max}, {data}) => {
      const minMax = getExtents(data.position);
      return {
        min: min.map((min, ndx) => Math.min(minMax.min[ndx], min)),
        max: max.map((max, ndx) => Math.max(minMax.max[ndx], max)),
      };
    }, {
      min: Array(3).fill(Number.POSITIVE_INFINITY),
      max: Array(3).fill(Number.NEGATIVE_INFINITY),
    });
  }
  
  const extents = getGeometriesExtents(obj.geometries);
  const range = subtraiVetores(extents.max, extents.min);  
  const objOffset = escalaVetor(somaVetores(extents.min,escalaVetor(range, 0.5)),-0.8);

  const extents2 = getGeometriesExtents(obj2.geometries);
  const range2 = subtraiVetores(extents2.max, extents2.min);
  const objOffset2 = escalaVetor(somaVetores(extents2.min,escalaVetor(range2, 0.5)),1);




  const cameraTarget = [0, 0, 0];

  const radius = length(range) * 1.2;

  const cameraPosition = somaVetores(cameraTarget, [
    0,
    0,
    radius,
  ]);

  const zNear = radius / 100;
  const zFar = radius * 3;

  function degToRad(deg) {
    return deg * Math.PI / 180;
  }

  function render(time) {
    time *= 0.001;  // convert to seconds

    const altura = Math.sin(time);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);

    const fieldOfViewRadians = degToRad(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = perspectiva(fieldOfViewRadians, aspect, zNear, zFar);


    const up = [0, 1, 0];
    
    const camera = lookAt(cameraPosition, cameraTarget, up);

    
    const view = inverte(camera);

    const sharedUniforms = {
      u_lightDirection: normaliza([-1, 3, 5]),
      u_view: view,
      u_projection: projection,
      u_viewWorldPosition: cameraPosition,
    };

    gl.useProgram(meshProgramInfo.program);

    // faz chamada do gl.uniform
    twgl.setUniforms(meshProgramInfo, sharedUniforms);

    let u_world = yRotacao(time/2);
    u_world = translate(u_world, ...objOffset);

    
    let u_world2 = yRotacao(time * 5);
    u_world2 = translate(u_world2, ...objOffset2);



    u_world2 = rotacaoEmTodosEixos(time * 2, time * 2, time * 2);
    u_world2 = translate(u_world2, 1 , 1 , 1);
    for (const {bufferInfo, vao, material} of parts2) {
      gl.bindVertexArray(vao);
      twgl.setUniforms(meshProgramInfo, { u_world : u_world2,}, material);
      twgl.drawBufferInfo(gl, bufferInfo);
    }
    
    u_world = translate(u_world, 0, altura, 0);
    
    for (const {bufferInfo, vao, material} of parts) {
      gl.bindVertexArray(vao);
      twgl.setUniforms(meshProgramInfo, { u_world,}, material);
      twgl.drawBufferInfo(gl, bufferInfo);

    }




    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
