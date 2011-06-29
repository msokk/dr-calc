require 'test_helper'

class CalculationsControllerTest < ActionController::TestCase
  setup do
    @calculation = calculations(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:calculations)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create calculation" do
    assert_difference('Calculation.count') do
      post :create, :calculation => @calculation.attributes
    end

    assert_redirected_to calculation_path(assigns(:calculation))
  end

  test "should show calculation" do
    get :show, :id => @calculation.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @calculation.to_param
    assert_response :success
  end

  test "should update calculation" do
    put :update, :id => @calculation.to_param, :calculation => @calculation.attributes
    assert_redirected_to calculation_path(assigns(:calculation))
  end

  test "should destroy calculation" do
    assert_difference('Calculation.count', -1) do
      delete :destroy, :id => @calculation.to_param
    end

    assert_redirected_to calculations_path
  end
end
