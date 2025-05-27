let count = 1;
let queriesCount = 1;
let sizeArray = [];
let typeArray = []; // 0 = memory, 1 = hole, 2 = process
let processRequests = [];
let allocatedProcesses = {
  firstFit: [],
  nextFit: [],
  bestFit: [],
  worstFit: [],
};
let unallocatedProcesses = {
  firstFit: 0,
  nextFit: 0,
  bestFit: 0,
  worstFit: 0,
};
let isAnimating = false;
let lastAllocatedIndex = 0;

// Add Input Button
document.getElementById("addInput").addEventListener("click", function () {
  count++;
  let newInputRow = document.createElement("div");
  newInputRow.className =
    "flex items-center gap-2 input-row animate__animated animate__fadeIn";

  let inputField = document.createElement("input");
  inputField.type = "number";
  inputField.min = "1";
  inputField.className = "w-full p-2 border rounded";
  inputField.placeholder = "Enter size";
  inputField.required = true;

  let memoryDiv = document.createElement("div");
  memoryDiv.className = "flex items-center gap-1";
  let memoryRadio = document.createElement("input");
  memoryRadio.type = "radio";
  memoryRadio.name = `inputType${count}`;
  memoryRadio.value = "memory";
  memoryRadio.className = "form-radio";
  let memoryLabel = document.createElement("label");
  memoryLabel.textContent = "Memory";
  memoryDiv.appendChild(memoryRadio);
  memoryDiv.appendChild(memoryLabel);

  let holeDiv = document.createElement("div");
  holeDiv.className = "flex items-center gap-1";
  let holeRadio = document.createElement("input");
  holeRadio.type = "radio";
  holeRadio.name = `inputType${count}`;
  holeRadio.value = "hole";
  holeRadio.className = "form-radio";
  let holeLabel = document.createElement("label");
  holeLabel.textContent = "Hole";
  holeDiv.appendChild(holeRadio);
  holeDiv.appendChild(holeLabel);

  newInputRow.appendChild(inputField);
  newInputRow.appendChild(memoryDiv);
  newInputRow.appendChild(holeDiv);

  document.getElementById("inputsContainer").appendChild(newInputRow);
  newInputRow.scrollIntoView({ behavior: "smooth" });
});

// Submit Memory Allocation Form
document
  .getElementById("memoryAllocationForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    if (isAnimating) return;
    isAnimating = true;

    sizeArray = [];
    typeArray = [];
    processRequests = [];
    allocatedProcesses = {
      firstFit: [],
      nextFit: [],
      bestFit: [],
      worstFit: [],
    };
    unallocatedProcesses = {
      firstFit: 0,
      nextFit: 0,
      bestFit: 0,
      worstFit: 0,
    };
    lastAllocatedIndex = 0;

    let errorMessages = [];

    let inputElements = document.querySelectorAll(
      "#inputsContainer input[type='number']"
    );
    inputElements.forEach(function (input, index) {
      let radioName = `inputType${index + 1}`;
      let inputType = document.querySelector(
        `input[name="${radioName}"]:checked`
      );
      if (!input.value || input.value < 1) {
        errorMessages.push(`Input ${index + 1} size must be at least 1`);
      }
      if (!inputType) {
        errorMessages.push(`Input ${index + 1} type is not selected`);
      }
      if (inputType && input.value && input.value >= 1) {
        sizeArray.push(parseInt(input.value));
        typeArray.push(inputType.value === "memory" ? 0 : 1);
      }
    });

    if (errorMessages.length > 0) {
      showStatusMessage(errorMessages.join("<br>"), "error");
      isAnimating = false;
      return;
    }

    showStatusMessage("Creating memory map...", "info");
    await new Promise((resolve) => setTimeout(resolve, 500));
    await show();
    showStatusMessage("Memory map created successfully!", "success");
    isAnimating = false;
  });

// Add Query Button
document.getElementById("addQuery").addEventListener("click", function () {
  queriesCount++;

  let newInputRow = document.createElement("div");
  newInputRow.className =
    "flex items-center gap-2 query-row animate__animated animate__fadeIn";

  let inputField = document.createElement("input");
  inputField.type = "number";
  inputField.min = "1";
  inputField.className = "w-full p-2 border rounded";
  inputField.placeholder = "Enter process size";
  inputField.required = true;

  newInputRow.appendChild(inputField);
  document.getElementById("queriesContainer").appendChild(newInputRow);
  newInputRow.scrollIntoView({ behavior: "smooth" });
});

// Submit Query Form
document
  .getElementById("queryForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    if (isAnimating) return;
    isAnimating = true;

    let queryArr = [];
    let errorMessages = [];

    let inputElements = document.querySelectorAll(
      "#queriesContainer input[type='number']"
    );
    inputElements.forEach(function (input, index) {
      if (!input.value || input.value < 1) {
        errorMessages.push(`Process ${index + 1} size must be at least 1`);
      } else {
        queryArr.push(parseInt(input.value));
      }
    });

    if (errorMessages.length > 0) {
      showStatusMessage(errorMessages.join("<br>"), "error");
      isAnimating = false;
      return;
    }

    if (sizeArray.length === 0) {
      showStatusMessage("Please create memory map first!", "error");
      isAnimating = false;
      return;
    }

    showStatusMessage("Allocating processes...", "info");
    processRequests = [...queryArr];
    allocatedProcesses = {
      firstFit: [],
      nextFit: [],
      bestFit: [],
      worstFit: [],
    };
    unallocatedProcesses = {
      firstFit: 0,
      nextFit: 0,
      bestFit: 0,
      worstFit: 0,
    };

    await new Promise((resolve) => setTimeout(resolve, 500));
    await processQueries(queryArr);
    showStatusMessage("Process allocation completed!", "success");
    isAnimating = false;
  });

function showStatusMessage(message, type) {
  const statusElement = document.getElementById("statusMessage");
  statusElement.innerHTML = message;
  statusElement.classList.remove(
    "hidden",
    "bg-red-100",
    "text-red-700",
    "bg-blue-100",
    "text-blue-700",
    "bg-green-100",
    "text-green-700",
    "bg-yellow-100",
    "text-yellow-700"
  );

  switch (type) {
    case "error":
      statusElement.classList.add("bg-red-100", "text-red-700");
      break;
    case "info":
      statusElement.classList.add("bg-blue-100", "text-blue-700");
      break;
    case "success":
      statusElement.classList.add("bg-green-100", "text-green-700");
      break;
    case "warning":
      statusElement.classList.add("bg-yellow-100", "text-yellow-700");
      break;
  }

  statusElement.classList.remove("hidden");
}

async function show() {
  await updateGrid(
    document.getElementById("hero"),
    sizeArray,
    typeArray,
    "Initializing memory map..."
  );
  await updateGrid(
    document.getElementById("first"),
    [...sizeArray],
    [...typeArray],
    "Preparing First Fit..."
  );
  await updateGrid(
    document.getElementById("next"),
    [...sizeArray],
    [...typeArray],
    "Preparing Next Fit..."
  );
  await updateGrid(
    document.getElementById("best"),
    [...sizeArray],
    [...typeArray],
    "Preparing Best Fit..."
  );
  await updateGrid(
    document.getElementById("worst"),
    [...sizeArray],
    [...typeArray],
    "Preparing Worst Fit..."
  );
  document.getElementById("summaryBody").innerHTML = "";
}

async function processQueries(queryArr) {
  let firstArr = [...sizeArray];
  let firstHoles = [...typeArray];
  let nextArr = [...sizeArray];
  let nextHoles = [...typeArray];
  let bestArr = [...sizeArray];
  let bestHoles = [...typeArray];
  let worstArr = [...sizeArray];
  let worstHoles = [...typeArray];

  for (let index = 0; index < queryArr.length; index++) {
    const processSize = queryArr[index];
    showStatusMessage(`Allocating ${processSize}kb process...`, "info");

    await Promise.all([
      firstFit(index, processSize, firstArr, firstHoles),
      nextFit(index, processSize, nextArr, nextHoles),
      bestFit(index, processSize, bestArr, bestHoles),
      worstFit(index, processSize, worstArr, worstHoles),
    ]);

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  updateSummary(
    firstArr,
    firstHoles,
    nextArr,
    nextHoles,
    bestArr,
    bestHoles,
    worstArr,
    worstHoles
  );
}

async function firstFit(processIndex, x, arr, holes) {
  let insertIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= x && holes[i] === 1) {
      insertIndex = i;
      break;
    }
  }

  if (insertIndex === -1) {
    unallocatedProcesses.firstFit += x;
    return;
  }

  const originalHoleSize = arr[insertIndex];
  const firstEle = document.getElementById("first");
  const blocks = firstEle.querySelectorAll(".item");
  if (blocks[insertIndex]) {
    blocks[insertIndex].classList.add("highlight");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  allocatedProcesses.firstFit.push({
    processIndex: processIndex,
    requestedSize: x,
    allocatedSize: arr[insertIndex],
    originalHoleSize: originalHoleSize,
  });

  const remainingSize = arr[insertIndex] - x;
  arr.splice(insertIndex, 1, x, remainingSize);
  holes.splice(insertIndex, 1, 2, 1);

  await updateGrid(firstEle, arr, holes, `Allocated ${x}kb with First Fit`);
}

async function nextFit(processIndex, x, arr, holes) {
  let insertIndex = -1;
  for (let i = lastAllocatedIndex; i < arr.length; i++) {
    if (arr[i] >= x && holes[i] === 1) {
      insertIndex = i;
      lastAllocatedIndex = i;
      break;
    }
  }

  if (insertIndex === -1) {
    for (let i = 0; i < lastAllocatedIndex; i++) {
      if (arr[i] >= x && holes[i] === 1) {
        insertIndex = i;
        lastAllocatedIndex = i;
        break;
      }
    }
  }

  if (insertIndex === -1) {
    unallocatedProcesses.nextFit += x;
    return;
  }

  const originalHoleSize = arr[insertIndex];
  const nextEle = document.getElementById("next");
  const blocks = nextEle.querySelectorAll(".item");
  if (blocks[insertIndex]) {
    blocks[insertIndex].classList.add("highlight");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  allocatedProcesses.nextFit.push({
    processIndex: processIndex,
    requestedSize: x,
    allocatedSize: arr[insertIndex],
    originalHoleSize: originalHoleSize,
  });

  const remainingSize = arr[insertIndex] - x;
  arr.splice(insertIndex, 1, x, remainingSize);
  holes.splice(insertIndex, 1, 2, 1);

  await updateGrid(nextEle, arr, holes, `Allocated ${x}kb with Next Fit`);
}

async function bestFit(processIndex, x, arr, holes) {
  let minSize = Infinity;
  let insertIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= x && holes[i] === 1 && arr[i] < minSize) {
      minSize = arr[i];
      insertIndex = i;
    }
  }

  if (insertIndex === -1) {
    unallocatedProcesses.bestFit += x;
    return;
  }

  const originalHoleSize = arr[insertIndex];
  const bestEle = document.getElementById("best");
  const blocks = bestEle.querySelectorAll(".item");
  if (blocks[insertIndex]) {
    blocks[insertIndex].classList.add("highlight");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  allocatedProcesses.bestFit.push({
    processIndex: processIndex,
    requestedSize: x,
    allocatedSize: arr[insertIndex],
    originalHoleSize: originalHoleSize,
  });

  const remainingSize = arr[insertIndex] - x;
  arr.splice(insertIndex, 1, x, remainingSize);
  holes.splice(insertIndex, 1, 2, 1);

  await updateGrid(bestEle, arr, holes, `Allocated ${x}kb with Best Fit`);
}

async function worstFit(processIndex, x, arr, holes) {
  let maxSize = -Infinity;
  let insertIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= x && holes[i] === 1 && arr[i] > maxSize) {
      maxSize = arr[i];
      insertIndex = i;
    }
  }

  if (insertIndex === -1) {
    unallocatedProcesses.worstFit += x;
    return;
  }

  const originalHoleSize = arr[insertIndex];
  const worstEle = document.getElementById("worst");
  const blocks = worstEle.querySelectorAll(".item");
  if (blocks[insertIndex]) {
    blocks[insertIndex].classList.add("highlight");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  allocatedProcesses.worstFit.push({
    processIndex: processIndex,
    requestedSize: x,
    allocatedSize: arr[insertIndex],
    originalHoleSize: originalHoleSize,
  });

  const remainingSize = arr[insertIndex] - x;
  arr.splice(insertIndex, 1, x, remainingSize);
  holes.splice(insertIndex, 1, 2, 1);

  await updateGrid(worstEle, arr, holes, `Allocated ${x}kb with Worst Fit`);
}

async function updateGrid(ele, arr, holes, statusText = "") {
  if (statusText) {
    showStatusMessage(statusText, "info");
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  ele.innerHTML = "";
  let gridTemplateColumns = "";

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= 0) continue;

    let block = document.createElement("div");
    block.innerHTML = `
                    <span>${arr[i]}kb</span>
                    <div class="progress-container">
                        <div class="progress-bar"></div>
                    </div>
                `;

    let typeText = "";
    let blockClass = "";

    if (holes[i] === 1) {
      typeText = "Hole";
      blockClass = "red item tooltip pulse";
    } else if (holes[i] === 2) {
      typeText = "Process";
      blockClass = "yellow item tooltip";
    } else {
      typeText = "Memory";
      blockClass = "blue item tooltip";
    }

    block.setAttribute("data-tooltip", `${typeText} - ${arr[i]}kb`);
    block.className = blockClass + " new-block";

    ele.appendChild(block);
    gridTemplateColumns += `${arr[i]}fr `;

    setTimeout(() => {
      const progressBar = block.querySelector(".progress-bar");
      if (progressBar) {
        progressBar.style.width = "100%";
      }
    }, 100);
  }

  ele.style.gridTemplateColumns = gridTemplateColumns;
  await new Promise((resolve) => setTimeout(resolve, 200));
}

function updateSummary(
  firstArr,
  firstHoles,
  nextArr,
  nextHoles,
  bestArr,
  bestHoles,
  worstArr,
  worstHoles
) {
  const firstFragmentation = calculateFragmentation(
    firstArr,
    firstHoles,
    allocatedProcesses.firstFit
  );
  const nextFragmentation = calculateFragmentation(
    nextArr,
    nextHoles,
    allocatedProcesses.nextFit
  );
  const bestFragmentation = calculateFragmentation(
    bestArr,
    bestHoles,
    allocatedProcesses.bestFit
  );
  const worstFragmentation = calculateFragmentation(
    worstArr,
    worstHoles,
    allocatedProcesses.worstFit
  );

  document.getElementById("summaryBody").innerHTML = `
        <tr class="border animate__animated animate__fadeIn">
            <td class="border p-2">First Fit</td>
            <td class="border p-2">${firstFragmentation.external}kb</td>
            <td class="border p-2">${unallocatedProcesses.firstFit}kb</td>
        </tr>
        <tr class="border animate__animated animate__fadeIn animate__delay-1s">
            <td class="border p-2">Next Fit</td>
            <td class="border p-2">${nextFragmentation.external}kb</td>
            <td class="border p-2">${unallocatedProcesses.nextFit}kb</td>
        </tr>
        <tr class="border animate__animated animate__fadeIn animate__delay-2s">
            <td class="border p-2">Best Fit</td>
            <td class="border p-2">${bestFragmentation.external}kb</td>
            <td class="border p-2">${unallocatedProcesses.bestFit}kb</td>
        </tr>
        <tr class="border animate__animated animate__fadeIn animate__delay-3s">
            <td class="border p-2">Worst Fit</td>
            <td class="border p-2">${worstFragmentation.external}kb</td>
            <td class="border p-2">${unallocatedProcesses.worstFit}kb</td>
        </tr>
    `;
}

function calculateFragmentation(arr, holes, allocations) {
  let externalFragmentation = 0;

  // External fragmentation is the sum of all remaining holes
  for (let i = 0; i < arr.length; i++) {
    if (holes[i] === 1) {
      externalFragmentation += arr[i];
    }
  }

  return {
    external: externalFragmentation,
  };
}

function updateSummary(
  firstArr,
  firstHoles,
  nextArr,
  nextHoles,
  bestArr,
  bestHoles,
  worstArr,
  worstHoles
) {
  const firstFragmentation = calculateFragmentation(
    firstArr,
    firstHoles,
    allocatedProcesses.firstFit
  );
  const nextFragmentation = calculateFragmentation(
    nextArr,
    nextHoles,
    allocatedProcesses.nextFit
  );
  const bestFragmentation = calculateFragmentation(
    bestArr,
    bestHoles,
    allocatedProcesses.bestFit
  );
  const worstFragmentation = calculateFragmentation(
    worstArr,
    worstHoles,
    allocatedProcesses.worstFit
  );

  document.getElementById("summaryBody").innerHTML = `
                <tr class="border animate__animated animate__fadeIn">
                    <td class="border p-2">First Fit</td>
                    <td class="border p-2">${firstFragmentation.external}kb</td>
                    <td class="border p-2">${unallocatedProcesses.firstFit}kb</td>
                </tr>
                <tr class="border animate__animated animate__fadeIn animate__delay-1s">
                    <td class="border p-2">Next Fit</td>
                    <td class="border p-2">${nextFragmentation.external}kb</td>
                    <td class="border p-2">${unallocatedProcesses.nextFit}kb</td>
                </tr>
                <tr class="border animate__animated animate__fadeIn animate__delay-2s">
                    <td class="border p-2">Best Fit</td>
                    <td class="border p-2">${bestFragmentation.external}kb</td>
                    <td class="border p-2">${unallocatedProcesses.bestFit}kb</td>
                </tr>
                <tr class="border animate__animated animate__fadeIn animate__delay-3s">
                    <td class="border p-2">Worst Fit</td>
                    <td class="border p-2">${worstFragmentation.external}kb</td>
                    <td class="border p-2">${unallocatedProcesses.worstFit}kb</td>
                </tr>
            `;
}

// Initialize
window.addEventListener("DOMContentLoaded", function () {
  // Nothing needed here now since HTML already has the initial rows
});
