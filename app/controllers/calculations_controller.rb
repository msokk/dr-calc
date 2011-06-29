class CalculationsController < ApplicationController
  # GET /calculations
  def index
    @calculations = Calculation.all
    render :json => @calculations
  end

  # GET /calculations/1
  def show
    @calculation = Calculation.find(params[:id])
    render :json => @calculation
  end

  # POST /calculations
  def create
    puts params[:calculation]
    @calculation = Calculation.new(params[:calculation])
    @calculation.save
    render :json => @calculation
  end

  # PUT /calculations/1
  def update
    @calculation = Calculation.find(params[:id])
    if @calculation.update_attributes(params[:calculation])
      render :json => { head => ok }
    else
      render :json => @calculation.errors, :status => :unprocessable_entity
    end
  end

  # DELETE /calculations/1
  def destroy
    @calculation = Calculation.find(params[:id])
    @calculation.destroy

    render :json => { head => ok }
  end
end
