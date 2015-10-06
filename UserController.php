<?php
namespace app\controllers;

use yii\rest\ActiveController;
use app\models\User;
use app\models\LoginForm;
use app\models\UserRoleView;
use app\models\Role;

class UserController extends ActiveController
{
    public $modelClass = 'app\models\User';

    public function actionLogin()
    {
        $modelLoginFrom = new LoginForm();
        if ($modelLoginFrom->load(\Yii::$app->getRequest()->getBodyParams(), '') && $modelLoginFrom->login()) {

            $modelRoleView = new UserRoleView();

            $result = $modelRoleView->find()
                ->where(['=','user_id', \Yii::$app->user->identity->getId()]
                )->all();

            $roles_table = new Role();
            foreach($result as $key){
                $role_name = $roles_table->find()
                    ->where(['=','role_id', $key->role_id]
                    )->one();
                $user_role[] = $role_name->name;
            }
            return [
                \Yii::$app->user->identity->getAuthKey(),
                $user_role
            ];
        } else {
            return $modelLoginFrom;
        }
    }
    public function actionRestorepass(){
        if (!$post = \Yii::$app->getRequest()->getBodyParams()) {
            throw new \yii\web\HttpException(400, 'No data was posted');
        }
        $model = User::findByUsername($post['username']);
        if (!$model->username){
            throw new \yii\web\HttpException(400, 'Username is incorrect');
        }
        $model->generatePasswordResetToken();
        $url = 'http://web/site/restorepassword?u=' . $model->username . '&p=' . $model->password_reset_token;
        \Yii::$app->mailer->compose()
            ->setFrom('localhost@gmail.com')
            ->setTo($model->email)
            ->setSubject('Відновлення паролю')
            ->setTextBody('')
            ->setHtmlBody("<b><a href=\"$url\">$url</a></b>")
            ->send();
        $model->save();
        return true;
    }
    public function actionChangepass(){
        if (!$post = \Yii::$app->getRequest()->getBodyParams()) {
            throw new \yii\web\HttpException(400, 'No data was posted');
        }
        $model = User::findByPasswordResetToken($post['token']);
        if (!$model) {
            throw new \yii\web\HttpException(422, 'Password reset token is not valid');
        }
        $password = $post['password'];
        $validator = new \yii\validators\StringValidator([
            'min' => 3,
            'max' => 12
        ]);
        if (!$validator->validate($password, $error)) {
            throw new \yii\web\HttpException(422, $error);
        }
        $model->setPassword($post['password']);
        $model->removePasswordResetToken();
        $model->save();
        echo $model->username;
        exit('ok');
    }
}