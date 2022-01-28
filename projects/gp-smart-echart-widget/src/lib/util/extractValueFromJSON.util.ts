/**
 * Copyright (c) 2021 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
export function extractValueFromJSON(keyArr: Array<string> | string, parent: Record<string, any>) {
    const keysArray = Array.isArray(keyArr) ? keyArr : [keyArr];
    const resultArray = [];
    for (const keyStr of keysArray) {
        const keys = keyStr.split('.');
        let parentRef = parent;
        if (keys.length === 1) {
            resultArray.push(parentRef[keys[0]]);
        } else {
            let result;
            for (let idx = 0; idx < keys.length; idx++) {
                const key = keys[idx];
                result = parentRef[key];
                if (isObject(result)) {
                    parentRef = result;
                } else if (idx < keys.length - 1) {
                }
            }
            resultArray.push(result);
        }
    }
    if (keysArray.length > 1) {
        return resultArray.join(' ');
    }
    return resultArray[0];
}
