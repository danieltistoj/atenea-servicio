import { config } from '../config/default.js'
import { initializeApp } from 'firebase/app'
import { collection, getDocs, getFirestore, addDoc, updateDoc, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'

export class FireBase {
    constructor(config) {
        //console.log(config)
        this._firebaseConfig = {
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            databaseURL: config.databaseURL,
            projectId: config.projectId,
            storageBucket: config.storageBucket,
            messagingSenderId: config.messagingSenderId,
            appId: config.appId,
        }
    }

    appInitialize() {
        const app = initializeApp(this._firebaseConfig)
        return app
    }

    getDB() {
        const app = this.appInitialize()
        const db = getFirestore(app)
        return db
    }

    async getData(name) {
        const allData = collection(this.getDB(), name);
        const dataDocs = await getDocs(allData);
        const docsList = dataDocs.docs.map(doc => Object.assign(doc.data(), {id : doc.id}));
        return docsList;
    }

    async saveData(name, data) {
        console.log(name, data)
        const docRef = await addDoc(collection(this.getDB(), name), data)
        return 'Data Save'
    }

    async saveGrade(name, data) {
        const allData = collection(this.getDB(), name);
        const dataDocs = await getDocs(allData);
        const docsList = dataDocs.docs.map(doc => doc.data());
        let pos = 0
        for (const elements of docsList) {
            if (elements.levelRef == data.levelRef) {
                console.log("ellevref " + elements.levelRef + " datalevref" + data.levelRef)
                pos++
            }
        }

        data.position = pos
        const docRef = await addDoc(collection(this.getDB(), name), data)
        return 'Data Save'
    }

    async updateData(name, id, data) {
        try {
            const docRef = doc(this.getDB(), name, id);
            const docSnap = await updateDoc(docRef, data);
            return "Data Updated";
        } catch (error) {
            return error;
        }
    }
    async setData(name, id, data) {
        try {
            const db = this.getDB()
            const docSnap = await db.collection(name).doc(id).setDoc(data, { merge: true })
            return "Data Updated";
        } catch (error) {
            return error;
        }
    }
    async deleteData(name, id) {
        try {
            const docRef = doc(this.getDB(), name, id)
            const docSnap = await deleteDoc(docRef);
            return "Delete Data"
        } catch (error) {
            console.log("Error")
            return error
        }
    }
    async deleteGrade(name, id) {
        // Datos del grado que se va a eliminar
        const oldGradeRef = doc(this.getDB(), name, id)
        const oldGradeSnap = await getDoc(oldGradeRef);
        const oldGrade = oldGradeSnap.data()

        // Lista de los grados, la posicion de los grados que vayan despues de este grado, va a decrementar en 1
        const allData = collection(this.getDB(), name);
        const dataDocs = await getDocs(allData);
        const docsList = dataDocs.docs.map(doc => Object.assign(doc.data(), {id : doc.id}));

        for (const elements of docsList) {
            if (elements.position > oldGrade.position) {
                elements.position--
                console.log("hola")
                console.log(elements)
                const gradeRef = doc(this.getDB(), name, elements.id);
                console.log("tu")
                const gradeSnap = await updateDoc(gradeRef, elements);
            }
        }

        try {
            const docRef = doc(this.getDB(), name, id)
            const docSnap = await deleteDoc(docRef);
            return "Delete Data"
        } catch (error) {
            console.log("Error")
            return error
        }
    }
    async getOneData(name, id) {
        try {
            const docRef = doc(this.getDB(), name, id)
            const docSnap = await getDoc(docRef);
            const oneData = docSnap.data()

            oneData.id = id

            return oneData
        } catch (error) {
            return error
        }
    }

    async getOneGrade(name, id) {
        try {
            const docRef = doc(this.getDB(), name, id)
            const docSnap = await getDoc(docRef);
            const oneData = docSnap.data()

            const teacherRef = oneData.teacherRef
            const teacherSnap = await getDoc(teacherRef);
            const teacherData = teacherSnap.data()

            oneData.teacherRef = teacherData
            oneData.id = id

            return oneData
        } catch (error) {
            return error
        }
    }

    async getDocRef(name, id) {
        const docRef = doc(this.getDB(), name, id)
        return docRef
    }

    //hacer funcion getdocbyref

    async addGradesToTeacher(name, id, data, oldGrades) {
        try {
            const docRef = doc(this.getDB(), name, id);
            for (const grade of data.gradesList) {
                const gradeRef = doc(this.getDB(), "Grades", grade)
                oldGrades.push(gradeRef)
            }
            data.gradesList = oldGrades
            const docSnap = await updateDoc(docRef, data);
            return "Data Updated";
        } catch (error) {
            return error;
        }
    }
    async deleteGradesToTeacher(name, id, gradeId, data) {
        try {
            const docRef = doc(this.getDB(), name, id);
            const newGradesList = []
            var gradeFinded = false
            for (const grade of data.gradesList) {
                if (grade._key.path.segments[6] != gradeId) {
                    newGradesList.push(grade)
                } else {
                    gradeFinded = true
                }
            }
            data.gradesList = newGradesList

            if (gradeFinded) {
                const docSnap = await updateDoc(docRef, data);
                return "Grade Removed";
            } else {
                return "No se ha encontrado el grado ingresado"
            }

        } catch (error) {
            return error;
        }
    }
}

// const newFireBase = new FireBase(config.fireBase)
// const result = newFireBase.getDB()
// console.log(result);

