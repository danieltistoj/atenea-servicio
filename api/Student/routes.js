export class StudentRouter{
    constructor(router, controller, response, httpCode){
        this._router = router()
        this._controller = controller
        this._response = response
        this._httpcode = httpCode
        this.registerRouter() 
    }

    registerRouter(){
        this._router.post('/create-student', this.handleCreateStudent.bind(this))
        this._router.get('/getall-students', this.handleGetAllStudents.bind(this))
        this._router.get('/getone-bygrade/:id', this.handleGetStudentsByGrade.bind(this))
        this._router.get('/getone-student/:id', this.handleGetOneStudent.bind(this))
        this._router.put('/update-student/:id', this.handleUpdateStudent.bind(this))
        this._router.put('/delete-student/', this.handleDeleteStudent.bind(this))

    }

    async handleCreateStudent(req, res){
        try {
            const student = req.body
            const result = await this._controller.createNewStudent(student)
            this._response.succes(req, res, result, this._httpcode.CREATED)
        } catch (error) {
            this._response.error(req, res, error, this._httpcode.BAD_REQUEST)
        }
    }

    async handleGetAllStudents(req, res){
        try {
            const result = await this._controller.getAllStudents()
            this._response.succes(req, res, result, this._httpcode.OK)
        } catch (error) {
            this._response.error(req, res, error, this._httpcode.BAD_REQUEST)
        }
    }

    async handleGetStudentsByGrade(req, res){
        try {
            const uidGradeRef = req.params.id
            const result = await this._controller.getStudentsByGrade(uidGradeRef)
            if (result.size === 0) {
                this._response.error(req, res, 'Error. Por favor verifica los datos e intenta de nuevo.', this._httpcode.BAD_REQUEST)
            }else{
                this._response.succes(req, res, result, this._httpcode.OK)
            }
        } catch (error) {
            this._response.error(req, res, error, this._httpcode.BAD_REQUEST)
        }
    }

    async handleGetOneStudent(req, res){
        try {
            const uid = req.params.id
            const result = await this._controller.getOneStudent(uid)
            if (!result.code) {
                this._response.succes(req, res, result, this._httpcode.OK)
            }else{
                this._response.error(req, res, 'Error.  Por favor verifica los datos e intenta de nuevo.', this._httpcode.BAD_REQUEST)
            }
        } catch (error) {
            this._response.error(req, res, error, this._httpcode.BAD_REQUEST)
        }
    }

    async handleUpdateStudent(req, res){
        try {
            const student = req.body
            const uid = req.params.id
            const result = await this._controller.updateStudent(student, uid)
            if (!result.code) {
                this._response.succes(req, res, result, this._httpcode.OK)
            }else{
                this._response.error(req, res, 'Error.  Por favor verifica los datos e intenta de nuevo.', this._httpcode.BAD_REQUEST)
            }
        } catch (error) {
            this._response.error(req, res, error, this._httpcode.BAD_REQUEST)
        }
    }

    async handleDeleteStudent(req, res){
        try {
            const student = req.body
            const result = await this._controller.deleteStudent(student)
            if (!result.code) {
                this._response.succes(req, res, result, this._httpcode.OK)
            }else{
                this._response.error(req, res, 'Error.  Por favor verifica los datos e intenta de nuevo.', this._httpcode.BAD_REQUEST)
            }
        } catch (error) {
            this._response.error(req, res, error, this._httpcode.BAD_REQUEST)
        }
    }
}