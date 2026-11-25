//  Scheduling (FCFS + Priority), simulationSteps,نتائج الحسابات CT, TAT, WT والمتوسطات

 // FCFS

function runFCFS(processes) {

    // ننسخ العمليات عشان ما نغير القائمة الأصلية
    const sortedProcesses = [];

    for (const process of processes) {
        sortedProcesses.push(process);
    }

    // نرتب العمليات حسب Arrival Time
    sortedProcesses.sort(function (a, b) {
        return a.at - b.at;
    });

    // نجهز الوقت والجداول
    let currentTime = 0;

    const results = [];
    const timeline = [];

    // ننفذ العمليات بالترتيب
    for (const process of sortedProcesses) {

        // نحدد وقت بداية العملية
        let startTime = currentTime;

        if (process.at > currentTime) {
            startTime = process.at;
        }

        // نسجل الـ IDLE إذا فيه انتظار
        if (startTime > currentTime) {
            timeline.push({
                pid: "IDLE",
                start: currentTime,
                end: startTime
            });
        }

        // نحسب أوقات العملية
        const completionTime = startTime + process.bt;
        const turnaroundTime = completionTime - process.at;
        const waitingTime = turnaroundTime - process.bt;

        // نحفظ نتائج العملية
        results.push({
            pid: process.pid,
            at: process.at,
            bt: process.bt,
            startTime: startTime,
            ct: completionTime,
            tat: turnaroundTime,
            wt: waitingTime
        });

        // نسجل فترة تشغيل العملية
        timeline.push({
            pid: process.pid,
            start: startTime,
            end: completionTime
        });

        // نحدث الوقت بعد انتهاء العملية
        currentTime = completionTime;
    }

    // نجمع القيم عشان نحسب المتوسطات
    let totalCT = 0;
    let totalTAT = 0;
    let totalWT = 0;

    for (const result of results) {
        totalCT = totalCT + result.ct;
        totalTAT = totalTAT + result.tat;
        totalWT = totalWT + result.wt;
    }

    // نحسب المتوسط مرة وحدة بعد انتهاء اللوب
    let averageCT = 0;
    let averageTAT = 0;
    let averageWT = 0;

    if (results.length > 0) {
        averageCT = totalCT / results.length;
        averageTAT = totalTAT / results.length;
        averageWT = totalWT / results.length;
    }

    const averages = {
        ct: averageCT,
        tat: averageTAT,
        wt: averageWT
    };

    // نربط FCFS بخطوات السيميوليتر
    const simulationSteps = createSimulationSteps(
        processes,
        timeline,
        results,
        "FCFS"
    );

    // نرجع البيانات لباقي أجزاء المشروع
    return {
        timeline: timeline,
        simulationSteps: simulationSteps,
        results: results,
        averages: averages
    };
}


// PRIORITY

function runPriority(processes) {

    // ننسخ العمليات عشان نقدر نحذف منها بعد التنفيذ
    const remainingProcesses = [];

    for (const process of processes) {
        remainingProcesses.push(process);
    }

    let currentTime = 0;

    const results = [];
    const timeline = [];

    // نستمر لين تنتهي جميع العمليات
    while (remainingProcesses.length > 0) {

        // نجهز قائمة العمليات اللي وصلت
        const availableProcesses = [];

        for (const process of remainingProcesses) {
            if (process.at <= currentTime) {
                availableProcesses.push(process);
            }
        }

        // نسجل الـ IDLE إذا ما فيه عملية جاهزة
        if (availableProcesses.length === 0) {

            // نبحث عن أقرب وقت وصول
            let nextArrival = remainingProcesses[0].at;

            for (const process of remainingProcesses) {
                if (process.at < nextArrival) {
                    nextArrival = process.at;
                }
            }

            timeline.push({
                pid: "IDLE",
                start: currentTime,
                end: nextArrival
            });

            currentTime = nextArrival;
        }

        else {

            // نختار العملية ذات الأولوية الأعلى
            // الرقم الأصغر يعني Priority أعلى
            let selectedProcess = availableProcesses[0];

            for (const process of availableProcesses) {

                if (process.priority < selectedProcess.priority) {
                    selectedProcess = process;
                }

                // إذا تساوت الأولوية نختار الأسبق وصولًا
                else if (process.priority === selectedProcess.priority) {

                    if (process.at < selectedProcess.at) {
                        selectedProcess = process;
                    }
                }
            }

            // نحسب أوقات العملية
            const startTime = currentTime;
            const completionTime = startTime + selectedProcess.bt;
            const turnaroundTime = completionTime - selectedProcess.at;
            const waitingTime = turnaroundTime - selectedProcess.bt;

            // نحفظ نتائج العملية
            results.push({
                pid: selectedProcess.pid,
                at: selectedProcess.at,
                bt: selectedProcess.bt,
                priority: selectedProcess.priority,
                startTime: startTime,
                ct: completionTime,
                tat: turnaroundTime,
                wt: waitingTime
            });

            // نسجل فترة تشغيل العملية
            timeline.push({
                pid: selectedProcess.pid,
                start: startTime,
                end: completionTime
            });

            // نحدث الوقت بعد انتهاء العملية
            currentTime = completionTime;

            // نحذف العملية بعد ما خلص تنفيذها
            let completedIndex = -1;

            for (let i = 0; i < remainingProcesses.length; i++) {

                if (remainingProcesses[i].pid === selectedProcess.pid) {
                    completedIndex = i;
                    break;
                }
            }

            if (completedIndex !== -1) {
                remainingProcesses.splice(completedIndex, 1);
            }
        }
    }

    // نجمع القيم عشان نحسب المتوسطات
    let totalCT = 0;
    let totalTAT = 0;
    let totalWT = 0;

    for (const result of results) {
        totalCT = totalCT + result.ct;
        totalTAT = totalTAT + result.tat;
        totalWT = totalWT + result.wt;
    }

    // نحسب المتوسط مرة وحدة بعد انتهاء اللوب
    let averageCT = 0;
    let averageTAT = 0;
    let averageWT = 0;

    if (results.length > 0) {
        averageCT = totalCT / results.length;
        averageTAT = totalTAT / results.length;
        averageWT = totalWT / results.length;
    }

    const averages = {
        ct: averageCT,
        tat: averageTAT,
        wt: averageWT
    };

    // نربط Priority بخطوات السيميوليتر
    const simulationSteps = createSimulationSteps(
        processes,
        timeline,
        results,
        "Priority"
    );

    // نرجع البيانات لباقي أجزاء المشروع
    return {
        timeline: timeline,
        simulationSteps: simulationSteps,
        results: results,
        averages: averages
    };
}


// SIMULATION STEPS

function createSimulationSteps(processes, timeline, results, algorithm) {

    // نجهز قائمة الخطوات والوقت المتبقي
    const simulationSteps = [];
    const remaining = {};

    // نعطي كل عملية وقتها الأصلي كبداية
    for (const process of processes) {
        remaining[process.pid] = process.bt;
    }

    // نحدد آخر وقت في المحاكاة
    let totalTime = 0;

    if (timeline.length > 0) {
        totalTime = timeline[timeline.length - 1].end;
    }

    // نسجل حالة المعالج عند كل وحدة زمنية
    for (let time = 0; time <= totalTime; time++) {

        // نبحث عن الفترة اللي يقع فيها الوقت الحالي
        let currentInterval = null;

        for (const interval of timeline) {

            if (time >= interval.start && time < interval.end) {
                currentInterval = interval;
                break;
            }
        }

        // نحدد العملية الحالية أو IDLE
        let running = "IDLE";

        if (currentInterval !== null) {
            running = currentInterval.pid;
        }

        // نحدد العمليات اللي انتهت
        const completed = [];

        for (const result of results) {

            if (result.ct <= time) {
                completed.push(result.pid);
            }
        }

        // نحدد العمليات اللي وصلت وتنتظر التنفيذ
        const readyProcesses = [];

        for (const process of processes) {

            let isCompleted = false;

            // نتحقق هل العملية انتهت
            for (const pid of completed) {

                if (pid === process.pid) {
                    isCompleted = true;
                }
            }

            // نضيف العملية للـ Ready Queue إذا كانت تنتظر
            if (
                process.at <= time &&
                isCompleted === false &&
                process.pid !== running
            ) {
                readyProcesses.push(process);
            }
        }

        // نرتب الـ Ready Queue حسب الخوارزمية
        if (algorithm === "FCFS") {

            readyProcesses.sort(function (a, b) {
                return a.at - b.at;
            });
        }

        else {

            readyProcesses.sort(function (a, b) {

                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }

                return a.at - b.at;
            });
        }

        // نجهز أسماء العمليات الموجودة في Ready Queue
        const readyQueue = [];

        for (const process of readyProcesses) {
            readyQueue.push(process.pid);
        }

        // ننسخ الوقت المتبقي عشان نحفظ حالة هذه الخطوة
        const remainingCopy = {};

        for (const pid in remaining) {
            remainingCopy[pid] = remaining[pid];
        }

        // ننسخ قائمة العمليات المكتملة
        const completedCopy = [];

        for (const pid of completed) {
            completedCopy.push(pid);
        }

        // نحفظ حالة المحاكاة في الوقت الحالي
        simulationSteps.push({
            time: time,
            running: running,
            readyQueue: readyQueue,
            remaining: remainingCopy,
            completed: completedCopy
        });

        // ننقص الوقت المتبقي للعملية اللي تنفذ
        if (running !== "IDLE") {
            remaining[running] = remaining[running] - 1;
        }
    }

    // نرجع جميع خطوات المحاكاة
    return simulationSteps;
}
